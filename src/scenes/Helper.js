export class Helper {
    
    constructor(scene) {
        this.scene = scene;
    }

    validateEmail(email){
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid =  emailRegex.test(email);
    
        if(isValid == false) return false;
        return true;
    }
     
    crateInputField(type = 'email', phaceholder = 'Enter your Email'){
          // Create an HTML input element
          var input = document.createElement('input');
          input.type = type; 
          input.style.position = 'absolute';
          input.style.width = '680px'
          input.style.height = '75px'
          input.style.fontSize = '30px'
          input.style.fontStyle = 'italic'
          input.style.textAlign = 'center' 
          input.placeholder = phaceholder
          input.style.boxShadow = 'none'; 
          input.style.border = 'none'; 
          input.style.outline = 'none'; 

          document.body.appendChild(input); 

          return input;
    }

    createLabel(labelText = 'Do you buy travel insurance when you go on holiday?', labelColor ="#fff",  fontSize = '30px'){
        
       let label = document.createElement('label');
       label.innerText =  labelText;
       label.style.display = 'flex';
       label.style.width = '680px'
       label.style.alignItems = 'center'; // Align items vertically
       label.style.justifyContent = 'center'; // Center horizontally
       label.style.gap = '18px'; // Space between label and options
       label.style.fontSize = fontSize; // Bigger text 
       label.style.color = labelColor;

       document.body.appendChild(label); 
       return label;
    }

    createOptions(labelText = 'Do you buy travel insurance when you go on holiday?', labelColor ="#fff", fontSize = '30px')
    {
         
       // Create a container div with flexbox for centering
       let container = document.createElement('div');
       container.style.display = 'flex';
       container.style.width = '650px'
       container.style.alignItems = 'center'; // Align items vertically
       container.style.justifyContent = 'center'; // Center horizontally
       container.style.gap = '20px'; // Space between label and options
       container.style.fontSize = fontSize; // Bigger text 
       container.style.color = labelColor;
 
       // Create a wrapper for radio buttons
       let optionsContainer = document.createElement('div');
       optionsContainer.style.display = 'flex';
       optionsContainer.style.alignItems = 'center'; // Align items vertically
       optionsContainer.style.gap = '50px'; // Space between Yes and No
       optionsContainer.style.padding = '10px 0px'; // Space between Yes and No

       // Create Yes and No radio buttons
       let yesOption = this.createRadio('yes', 'Yes', true);
       let noOption = this.createRadio('no', 'No', false);
 

        // Append radio buttons to the options container
        optionsContainer.appendChild(yesOption);
        optionsContainer.appendChild(noOption);
    
        container.appendChild(optionsContainer);

        
        return container;
    }


    createRadio(value, text, isChecked = false) {
        let radioLabel = document.createElement('label');
        radioLabel.style.display = 'flex';
        radioLabel.style.alignItems = 'center';
        radioLabel.style.fontSize = '30px';

        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'agreement'; // Group name
        radio.value = value;
        radio.style.width = '40px'; // Bigger radio button
        radio.style.height = '40px';
        radio.style.marginRight = '5px';

        if (isChecked) {
            radio.checked = true; // Set as selected
        }

        radioLabel.appendChild(radio);
        radioLabel.appendChild(document.createTextNode(' ' + text));

        return radioLabel;
    }

    createResultText(text, fontSize = '70px', y=900){
        this.scene.add.text(this.scene.cameras.main.centerX, y, text, { 
            fontSize: fontSize, 
            fill: '#fff480', 
            fontFamily: 'Montserrat, sans-serif',  
            fontWeight: '500', 
            align: 'center' ,
            wordWrap: { width: 700, useAdvancedWrap: true } 
        }).setOrigin(0.5);
    }

    createInfoText(text){
        this.scene.add.text(this.scene.cameras.main.centerX, 800, text, { 
            fontSize: '70px', 
            fill: '#ffffff', 
            fontFamily: 'Montserrat, sans-serif',  
            fontWeight: '800',
            align: 'center' ,
            wordWrap: { width: 700, useAdvancedWrap: true } 
        }).setOrigin(0.5);
    }

    createTermsText(text){
        this.scene.add.text(this.scene.cameras.main.centerX, 900, text, { 
            fontSize: '70px', 
            fill: '#ffffff', 
            fontFamily: 'Montserrat, sans-serif',  
            fontWeight: '600' ,
            align: 'center' ,
            wordWrap: { width: 700, useAdvancedWrap: true } 
        }).setOrigin(0.5);
    } 

    getParameterByName(name) {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(window.location.search);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    } 

    post(apiUrl, body){ 
 
        fetch( apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
        .then(response => response.json())
        .then(data => {
            this.scene.data = data;
            this.animationManager.spinWheelAnimation(this.wheel, data.angle, this.displayResult.bind(this));
        })
        .catch(error => {
            console.error('Error while fetching data:', error);
              
        }); 

        return "TEST"
    }
}
 