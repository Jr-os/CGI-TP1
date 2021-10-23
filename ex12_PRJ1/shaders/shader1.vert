attribute vec4 vPosition;
uniform vec2 vec;
uniform float width;
uniform float height;


void main()
{
    gl_PointSize = 4.0;
    gl_Position = vPosition / vec4 (width/2.0, height/2.0, 1 ,1) ;
    
}
