export class Functions 
{
    constructor(sw, sh)
    {
        this.scalewidth = sw;
        this.scaleheight = sh
    }
    resetPosition(obj, x, y, scale = true)
    {
        const photoshopWidth  = 1080; // 2070 
        const photoshopHeight = 1920; // 4480
        
        const widthScaleFactor  =  this.scalewidth / photoshopWidth;
        const heightScaleFactor =  this.scaleheight / photoshopHeight;

        const objWidthScaleFactor = obj.width / photoshopWidth
        const objHeightScaleFactor = obj.width / photoshopHeight
 
        if(scale){
          const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor);
          obj.setScale(scaleFactor);
        }
         
 
        
        /*
        if(obj.displayWidth < this.scalewidth)
        {
            const scaleFactor = Math.max(widthScaleFactor, heightScaleFactor);
            obj.setScale(scaleFactor);
        }
        */
        
        //obj.setDisplaySize(obj.width * widthScaleFactor, obj.height * heightScaleFactor);
        // obj.setScale(obj.scale);
  
  
       obj.setPosition(x * widthScaleFactor, y * heightScaleFactor);
       
    } 

    
}