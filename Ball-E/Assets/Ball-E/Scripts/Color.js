﻿/**
* A color in HSV space
*/
class ColorHSV extends System.Object
{
    var h:float = 0.0;
    var s:float = 0.0;
    var v:float = 0.0;
    var a:float = 0.0;
    
    /**
    * Construct without alpha (which defaults to 1)
    */
    function ColorHSV(h:float, s:float, v:float)
    {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = 1.0;
    }
    
    /**
    * Construct with alpha
    */
    function ColorHSV(h:float, s:float, v:float, a:float)
    {
        this.h = h;
        this.s = s;
        this.v = v;
        this.a = a;
    }
    
    /**
    * Create from an RGBA color object
    */
    function ColorHSV(color:Color)
    {
        var min:float = Mathf.Min(Mathf.Min(color.r, color.g), color.b);
        var max:float = Mathf.Max(Mathf.Max(color.r, color.g), color.b);
        var delta:float = max - min;
 
        // value is our max color
        this.v = max;
 
        // saturation is percent of max
        if(!Mathf.Approximately(max, 0))
            this.s = delta / max;
        else
        {
            // all colors are zero, no saturation and hue is undefined
            this.s = 0;
            this.h = -1;
            return;
        }
 
        // grayscale image if min and max are the same
        if(Mathf.Approximately(min, max))
        {
            this.v = max;
            this.s = 0;
            this.h = -1;
            return;
        }
        
        // hue depends which color is max (this creates a rainbow effect)
        if( color.r == max )
            this.h = ( color.g - color.b ) / delta;         // between yellow & magenta
        else if( color.g == max )
            this.h = 2 + ( color.b - color.r ) / delta; // between cyan & yellow
        else
            this.h = 4 + ( color.r - color.g ) / delta; // between magenta & cyan
 
        // turn hue into 0-360 degrees
        this.h *= 60;
        if(this.h < 0 )
            this.h += 360;
    }
    
    /**
    * Return an RGBA color object
    */
    function ToColor():Color
    {
        // no saturation, we can return the value across the board (grayscale)
        if(this.s == 0 )
            return new Color(this.v, this.v, this.v, this.a);
 
        // which chunk of the rainbow are we in?
        var sector:float = this.h / 60;
        
        // split across the decimal (ie 3.87 into 3 and 0.87)
        var i:int; i = Mathf.Floor(sector);
        var f:float = sector - i;
        
        var v:float = this.v;
        var p:float = v * ( 1 - s );
        var q:float = v * ( 1 - s * f );
        var t:float = v * ( 1 - s * ( 1 - f ) );
        
        // build our rgb color
        var color:Color = new Color(0, 0, 0, this.a);
        
        switch(i)
        {
            case 0:
                color.r = v;
                color.g = t;
                color.b = p;
                break;
            case 1:
                color.r = q;
                color.g = v;
                color.b = p;
                break;
            case 2:
                color.r  = p;
                color.g  = v;
                color.b  = t;
                break;
            case 3:
                color.r  = p;
                color.g  = q;
                color.b  = v;
                break;
            case 4:
                color.r  = t;
                color.g  = p;
                color.b  = v;
                break;
            default:
                color.r  = v;
                color.g  = p;
                color.b  = q;
                break;
        }
        
        return color;
    }
    
    /**
    * Format nicely
    */
    function ToString():String
    {
        return String.Format("h: {0:0.00}, s: {1:0.00}, v: {2:0.00}, a: {3:0.00}", h, s, v, a);
    }
}