// C#
// SplitMeshIntoTriangles.cs
using UnityEngine;
using System.Collections;

public class SplitMeshIntoTriangles : MonoBehaviour
{
	IEnumerator SplitMesh ()
	{
		MeshFilter MF = GetComponent<MeshFilter>();
		MeshRenderer MR = GetComponent<MeshRenderer>();
		Mesh M = MF.mesh;
		Vector3[] verts = M.vertices;
		Vector3[] normals = M.normals;
		Vector2[] uvs = M.uv;
		for (int submesh = 0; submesh < M.subMeshCount; submesh++)
		{
			int[] indices = M.GetTriangles(submesh);
			for (int i = 0; i < indices.Length; i += 45)
			{
				Vector3[] newVerts = new Vector3[3];
				Vector3[] newNormals = new Vector3[3];
				Vector2[] newUvs = new Vector2[3];
				for (int n = 0; n < 3; n++)
				{
					int index = indices[i + n];
					newVerts[n] = verts[index];
					newUvs[n] = uvs[index];
					newNormals[n] = normals[index];
				}
				Mesh mesh = new Mesh();
				mesh.vertices = newVerts;
				mesh.normals = newNormals;
				mesh.uv = newUvs;
				
				mesh.triangles = new int[] { 0, 1, 2, 2, 1, 0 };

				GameObject GO = new GameObject("Triangle " + (i / 3));

				GO.transform.position = transform.position;
				GO.transform.rotation = transform.rotation;
				GO.AddComponent<MeshRenderer>().material = MR.materials[submesh];
				GO.AddComponent<MeshFilter>().mesh = mesh;
				//GO.AddComponent<BoxCollider>();
				GO.AddComponent<Rigidbody>().AddExplosionForce(10, transform.position, 100);
                GO.transform.localScale = GO.transform.localScale * Random.Range(0.0f, 2.5f);
				Destroy(GO, Random.Range(0.0f, 5.0f));
			}
		}
		MR.enabled = false;
		
		Time.timeScale = 0.7f;
		yield return new WaitForSeconds(0.1f);
	//	Time.timeScale = 0.3f;
		Destroy(gameObject);
	}
	void OnMouseDown()
	{
		StartCoroutine(SplitMesh());
	}
}