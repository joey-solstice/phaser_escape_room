import { CST } from "../CST.js" 
import { ImgButton } from "../prefabs/ImgButton.js"  
import { AnimationManager } from './AnimationManager.js'; 
import { AudioManager } from './AudioManager.js'; 
import { Helper } from './Helper.js'; 


export class GameScene extends Phaser.Scene {
    
    constructor() {
        super({ key: CST.SCENES.GAME }) 
        this.email = "";  
        this.name = "";
        this.buy = "yes"; 
        this.reasonOrCompany = ""; 
    }   

    create() 
    {   

        this.onDevelopment = true;
        this.animationManager = new AnimationManager(this);
        this.audioManager = new AudioManager(this); 
        this.helper = new Helper(this); 

        this.onSpin = false;
       
        this.displayAssets();
        this.setButtons();

        this.addEmailField();   
        this.audioManager.add(); 
        this.validateCode();  
 
    } 
     
    init(data)
    {
        this.data = data
    }

    validateCode(){
        this.qrCode = this.helper.getParameterByName('campaign_code');  
         
        if(this.qrCode == "" || this.qrCode == null){ 
            this.showErrorModal();
        }

        this.onDevelopment = this.qrCode == 'TEST' ? true  : false;
    }

    async checkEmailAlreadyPlayed(email) {
        try {
            const response = await fetch(`https://msigspin.solstice.sg/api/check-email?email=${encodeURIComponent(email)}`);
            const data = await response.json(); 
            return  data.data.has_played;  
        } catch (error) {
            console.error('Error:', error);
            return 'invalid'; // Return false if there's an error
        }
    }

    addEmailField(){  

        // NAME
        var nameLabel = this.helper.createLabel('Name*');
        this.nameLabelDom = this.add.dom(this.cameras.main.centerX, 1120, nameLabel); 

        // EMAIL
        var emailLabel = this.helper.createLabel('Email*');
        this.emailLabelDom = this.add.dom(this.cameras.main.centerX, 1270, emailLabel); 

        // OPTION
        var optionLabel = this.helper.createLabel('Do you buy travel insurance when you go on holiday?*');
        this.optionLabelDom = this.add.dom(this.cameras.main.centerX, 1450, optionLabel); 
 



        var input_name = this.helper.crateInputField('text', 'Enter your Name');
        this.inputNameDom = this.add.dom(this.cameras.main.centerX, 1180, input_name); 

        this.inputNameDom.addListener('input'); 
        this.inputNameDom.on('input', function (event) {  
            this.name = event.target.value; 
        }, this); 


        var input = this.helper.crateInputField();
        this.inputEmailDom = this.add.dom(this.cameras.main.centerX, 1330, input); 

        this.inputEmailDom.addListener('input'); 
        this.inputEmailDom.on('input', function (event) {  
            this.email = event.target.value; 
        }, this); 

        
      


        var options = this.helper.createOptions();
        this.optionsDom = this.add.dom(this.cameras.main.centerX, 1515, options); 

        this.optionsDom.addListener('input'); 
        this.optionsDom.on('input', function (event) {  
            const eventResult = event.target.value; 
            
           if(eventResult == 'no'){
                companyReasonLabel.innerText = "If no, Why?";
                comReasonInput.placeholder = "Enter Why";
           }else{
                companyReasonLabel.innerText = "If yes, which company do you buy? ";
                comReasonInput.placeholder = "Enter Company";
           }

           this.buy = eventResult;
           
            
        }, this); 

       
        var companyReasonLabel = this.helper.createLabel('If yes, which company do you buy?',   "#fff",   '30px');
        this.companyReasonLabelDom = this.add.dom(this.cameras.main.centerX, 1580, companyReasonLabel); 



        var comReasonInput = this.helper.crateInputField('text', 'Enter Company');
        this.comReasonInputDom = this.add.dom(this.cameras.main.centerX, 1640, comReasonInput); 

        this.comReasonInputDom.addListener('input'); 
        this.comReasonInputDom.on('input', function (event) {  
            this.reasonOrCompany = event.target.value;  
        }, this); 

        
    }
 
 

    displayEmailField(b = true){ 
        if(b == true && this.onSpin) return;

        this.optionLabelDom.setVisible(b);
        this.nameLabelDom.setVisible(b);
        this.emailLabelDom.setVisible(b);
        this.companyReasonLabelDom.setVisible(b);
        this.optionsDom.setVisible(b);

        this.inputEmailDom.setVisible(b);
        this.inputNameDom.setVisible(b);
        this.comReasonInputDom.setVisible(b);
    }

    resetField()
    { 
        this.displayEmailField(); // disaplay all

        this.spinBtn.setVisible(true); // shwo spin button
    }

    displayAssets() {
        this.pageBg = this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'general-bg').setOrigin(.5); 
        this.wheelBg = this.add.image(this.cameras.main.centerX, 580, 'wheelBg').setOrigin(.5).setScale(.95);
        this.wheel = this.add.image(this.cameras.main.centerX, 580, 'wheel').setOrigin(.5).setScale(1.1);
        this.wheelPointer = this.add.image(this.cameras.main.centerX, 560, 'wheelPointer').setOrigin(.5);   
        //this.nameField = this.add.image(this.cameras.main.centerX, 1180, 'emailField').setOrigin(.5);  
        //this.emailField = this.add.image(this.cameras.main.centerX, 1330, 'emailField').setOrigin(.5);
        //this.emailField = this.add.image(this.cameras.main.centerX, 1480, 'emailField').setOrigin(.5);
    } 

    setButtons(){ 
        this.infoBtn = new ImgButton(this,  992, 105, 'infoButton', () => this.showInfoModal());
        this.add.existing(this.infoBtn)   
        this.spinBtn = new ImgButton(this,  this.cameras.main.centerX, 1805, 'spinButton', () => this.SpinWheel());
        this.add.existing(this.spinBtn)   
        this.animationManager.animateButton(this.spinBtn);
    } 

    showInfoModal()
    {
        this.clickAudio.play();
        this.popupAudio.play();
        
        this.displayEmailField(false);
        this.scene.run(CST.SCENES.HOWTO)
    }

    showErrorModal(message = "Code is invalid", closable = false)
    {  
        this.popupAudio.play();
        this.displayEmailField(false);
        this.scene.run(CST.SCENES.ERROR, {message: message, closable: closable});
    }

    async  validateAndProceed() {
         
        
        const isEmailAlreadyPlayed = await this.checkEmailAlreadyPlayed(this.email);
            
        if(isEmailAlreadyPlayed === 'invalid'){
            this.showErrorModal(CST.ERRORCODES.EMAIL[422], true); 
        }else{ 
            if(!isEmailAlreadyPlayed){    
                this.displayEmailField(false);
                this.spinBtn.setVisible(false) 
                this.clickAudio.play(); 
                this.sendForm()  
                
            }else{  
                this.showErrorModal(CST.ERRORCODES.SPIN[461], true); 
                this.errorAudio.play();
            }   
        }
    }

    checkIfFormValid()
    {
        const isValidEmail = this.helper.validateEmail(this.email);
       
        const allFieldValid = {
            email: {valid: isValidEmail, dom: this.inputEmailDom},
            name: {valid: this.name != '', dom: this.inputNameDom},
            company: {valid: true, dom: this.comReasonInputDom},
        }
 
        if(this.buy === 'no' || this.buy === 'yes' ){
            allFieldValid.company.valid = true; 
        }else{
            allFieldValid.company.valid =  this.reasonOrCompany != '' ? true:false;
        } 

        Object.values(allFieldValid).forEach(field => {
            if (!field.valid) { 
                this.animationManager.wiggleField(field.dom);
                this.clickAudio.play();
                this.errorAudio.play();
            }
        });

        return Object.values(allFieldValid).every(field => field.valid);
    }

    SpinWheel(){ 
         
        if(this.onDevelopment){
            this.doDevTest()
        }else{
            const allFieldsAreValid = this.checkIfFormValid(); 
            if(allFieldsAreValid){ 
                
                this.spinBtn.setVisible(false) 
                this.validateAndProceed();
            }  
        }
        
    }


    sendForm()
    {
        
        const body = {
            campaign_code: this.qrCode,
            name: this.name,
            email:  this.email,
            has_travel_insurance: this.buy, 
            insurance_name: this.buy === 'yes' ? this.reasonOrCompany : '',
            ...(this.buy === 'no' && this.reasonOrCompany != '' ? { reason: this.reasonOrCompany } : {})  
        }

        fetch( CST.API.SPIN.url, {
            method: CST.API.SPIN.method,
            headers: CST.API.SPIN.headers,
            body: JSON.stringify(body)
        })
        .then(response => 
        {      
            const errorValue = this.getSpinErrorValueByStatusCode(response.status); 
            if(response.status == 200)
            {
                return response.json();
            }else{
                this.showErrorModal(errorValue, true); 
            } 
        })
        .then(data => { 
            if(data){ 
                this.onSpin = true;
                this.data = data; 

                const isValidResponseData = this.isValidPrizeData(data) 
                if(isValidResponseData){
                    this.animationManager.animateToCenter(this.wheel, this.wheelBg, this.wheelPointer, this.cameras.main.centerX, this.cameras.main.centerY, this.spinTheWheel.bind(this))
                }else{
                    this.showErrorModal('Unexpected Error! Please try again later.', true)
                }  
            } 
        })
        .catch(error => {  
            console.error('Error while fetching data:', error);
            this.showErrorModal("Please try again!", true);
        }); 
    }

    getSpinErrorValueByStatusCode(errorCode)
    { 
        return CST.ERRORCODES.SPIN[errorCode]  ?? 'Unknown Error.';  
    }

    isValidLength(value, min, max) {
        if (value.length < min || value.length > max) {
            return false;
        }
        return true;
    }

    spinTheWheel()
    {
        this.animationManager.spinWheelAnimation(this.wheel, this.data, this.displayResult.bind(this)); 
    }
 
    displayResult() {   
        this.time.delayedCall(500, function () {  
            this.scene.run(CST.SCENES.CONGRATS, this.data)
            this.congratsAudio.play();
        }, [], this);
    }

    isValidPrizeData(d) {
        const data = d.data  

        return (
            data &&
            typeof data === "object" &&
            data.prize_angle !== null &&  // Allows 0 but prevents null
            data.prize_angle !== undefined && // Ensures it exists
            data.prize_angle !== 'undefined' && // Ensures it exists
            data.prize_name && // Ensures it's not empty
            data.prize_name !== "" &&// Ensures it's not an empty string
            data.prize_name !== "undefined" // Ensures it's not an empty string
        );
    }

    // DEV

    doDevTest()
    {

        this.onSpin = true
        this.displayEmailField(false);
        this.spinBtn.setVisible(false)

        const body = {
            campaign_code: this.qrCode,
            name: 'Joey',
            email:  'joey@solstice.sg',
            has_travel_insurance: 'yes', 
            insurance_name: 'SOLSTICE', 
        }
        
        fetch( 'http://localhost/msig_spin_wheel/api/spin.php', {
            method: CST.API.SPIN.method,
            headers: CST.API.SPIN.headers,
            body: JSON.stringify(body)
        })
        .then(response => 
        {      
            const errorValue = this.getSpinErrorValueByStatusCode(response.status); 
            if(response.status == 200)
            {
                return response.json();
            }else{
                this.showErrorModal(errorValue, true); 
            } 
        })
        .then(data => { 
            if(data){ 
                this.onSpin = true;
                this.data = data;  
                const isValidResponseData = this.isValidPrizeData(data) 
                if(isValidResponseData){
                    this.animationManager.animateToCenter(this.wheel, this.wheelBg, this.wheelPointer, this.cameras.main.centerX, this.cameras.main.centerY, this.spinTheWheel.bind(this))
                }else{
                    this.showErrorModal('Unexpected Error! Please try again later.', true)
                } 
            } 
        })
        .catch(error => {  
            console.error('Error while fetching data:', error);
            this.showErrorModal("Please try again!", true);
        }); 
 
        // const prizes = [
        //     { prize_angle: 0, prize_name: '$5 Discount Voucher' },
        //     { prize_angle: 36, prize_name: 'Almost! Come Back For Another Shot!' },
        //     { prize_angle: 72, prize_name: '$3 Discount Voucher' }, 
        //     { prize_angle: 108, prize_name: 'Oops! No Prize\nThis Time.' },
        //     { prize_angle: 144, prize_name: '$10 Discount Voucher' },
        //     { prize_angle: 180, prize_name: 'Thank You For Your Participation' },
        //     { prize_angle: 216, prize_name: '$3 Discount Voucher' }, 
        //     { prize_angle: 252, prize_name: '$5 Discount Voucher' },
        //     { prize_angle: 288, prize_name: '$3 Discount Voucher' },
        //     { prize_angle: 324, prize_name: 'Better Luck Next Time' },
        // ]
        // const randomIndex = Math.floor(Math.random() * 10); 
        // const data = {data: prizes[1]}; 
        // this.data = data;
         
        // this.animationManager.animateToCenter(this.wheel, this.wheelBg, this.wheelPointer, this.cameras.main.centerX, this.cameras.main.centerY, this.spinTheWheel.bind(this))
        
    }
}
