Shader "kevert_2" {
	Properties {
		_Color ("Main Color", Color) = (.5,.5,.5,1)
		_OutlineColor ("Outline Color", Color) = (0,0,0,1)
		_Outline ("Outline width", Range (.002, 0.03)) = .005
		_MainTex ("Base (RGB)", 2D) = "white" { }
	//	_ToonShade ("ToonShader Cubemap(RGB)", CUBE) = "" { Texgen CubeNormal }
		_RefractTex ("Refraction Texture", Cube) = "dummy.jpg" {
			TexGen CubeReflect
		}
		_ReflectTex ("Reflection Texture", Cube) = "dummy.jpg" {
			TexGen CubeReflect
		}
	}
	
	CGINCLUDE
	#include "UnityCG.cginc"
	
	struct appdata {
		float4 vertex : POSITION;
		float3 normal : NORMAL;
	};

	struct v2f {
		float4 pos : POSITION;
		float4 color : COLOR;
	};
	
	uniform float _Outline;
	uniform float4 _OutlineColor;
	
	v2f vert(appdata v) {
		v2f o;
		o.pos = mul(UNITY_MATRIX_MVP, v.vertex);

		float3 norm   = mul ((float3x3)UNITY_MATRIX_IT_MV, v.normal);
		float2 offset = TransformViewToProjection(norm.xy);

		o.pos.xy += offset* o.pos.z * _Outline;
		o.color = _OutlineColor;
		return o;
	}
	ENDCG

	SubShader {
		Tags { "RenderType"="Opaque" }
		UsePass "Toon/Basic/BASE"
		Pass {
			Name "OUTLINE"
			Tags { "LightMode" = "Always" }
			Cull Front
			ZWrite On
			ColorMask RGB
			Blend SrcAlpha OneMinusSrcAlpha

			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			half4 frag(v2f i) :COLOR { return i.color; }
			ENDCG
		}
	}
	
	SubShader {
		Tags {
			"Queue" = "Transparent"
		}
		// First pass - here we render the backfaces of the diamonds. Since those diamonds are more-or-less
		// convex objects, this is effectively rendering the inside of them
		Pass {
			Color (0,0,0,0)
			//Offset  -1, -1
			//Cull Front
			ZWrite On
			Blend SrcAlpha OneMinusSrcAlpha
			
			SetTexture [_RefractTex] {
				constantColor [_Color]
				combine texture * constant, primary
			}
			SetTexture [_ReflectTex] {
				combine previous * texture, previous +- texture
			}
		
			SetTexture [_MainTex] {
				combine texture, primary
			}

		}

		// Second pass - here we render the front faces of the diamonds.
		Pass {
			Fog { Color (0,0,0,0)}
			ZWrite on
			Blend One One
			SetTexture [_RefractTex] {
				constantColor [_Color]
				combine texture * constant
			}
			SetTexture [_ReflectTex] {
				combine texture + previous, previous +- texture
			}
		}
	}
	
	Fallback "Toon/Basic"
}
