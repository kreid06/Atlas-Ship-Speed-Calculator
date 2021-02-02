HTMLElement.prototype.addClass = function(value){
    !this.classList.contains(value) ? this.classList.add(value):null;
} 
HTMLElement.prototype.removeClass = function(value){
    this.classList.contains(value) ? this.classList.remove(value):null;
}



let configArray = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
let customConfig = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]
let prevTarget = null;
let prevSelected = null;
let currentWeight = 3000;
let maximumWeight = 30000;
let percentWeight = 10;
let speedSail = 4.4
let handleSail = 3.266
let weightSail = 2.608
let maxSpeed = 26.4
let weightFactor = 10.189
let maxSpecialValue = null;
let pointsInWgt = 0;
let additionalWgt = 0;
let sailWgt = 0;

let lgWgtSailBase =  4000;

let sailskN = null;
let sailsRelPer = null
let sailsMaxPer = null
////////// Modal Variables //////////

let modalSelected = null;
let modalSpecialInput = false;
let sailModalInputValue = 100;
let currentCard = null

////////// Container Variables //////////
var sailItems,
    configButtons,
    weightPercentInput,
    currentWeightInput,
    maximumWeightInput,
    sailContainer,
    changeSailModal,
    modalInputTitle,
    modalInputValue,
    modalInputContainer,
    modalConfirmButton,
    calculateMaxKnot,
    calculateMaxPercent,
    calculateRelPercent,
    customButton,
    wgtButtons,
    shipSpecContainer,
    specWgtPoints,
    additionalWgtValue

////////// Global Function ////////////

function checkDecimalLength(number){
    return number.split(".")[1] ? number.split(".")[1].length > 4 : false
}

function loadSailConfig(){
    let sailIndex = 0;
    sailContainer.innerHTML = ""
    
    for([sailID, sailValue] of configArray){
        let sailValueExt= "";

        switch(sailID){
            case 2:
                sailValueExt = `Sail Accel: ${sailValue}%`
                break;
            case 3:
                sailValueExt = `Max Move Weight: ${sailValue}%`
                break;
        }

        let divContainer =  document.createElement("div")
            // divName   = document.createElement("div"),
            // divedit   = document.createElement("div"),
            // divdelete = document.createElement("div"),
            // div
            divContainer.innerHTML = 
            `            
               <div id="sail-${sailIndex}-name" class="sail-title">
                    
                </div>
                <div id="sail-${sailIndex}-special" class="sail-special">
                    ${sailValueExt}
                </div>
                <div class="sail-card-button-container">
                    
                    <div id="sail-${sailIndex}-change" class="sail-card-button change-button">
                        CHANGE
                    </div>
                    <div id="sail-${sailIndex}-delete" class="sail-card-button delete-button">
                        DELETE
                    </div>
                </div>    
            `
            divContainer.setAttribute("id", "sail-"+sailIndex)
            divContainer.classList.add('sail-item')
        
            sailContainer.appendChild(divContainer);

            divContainer = document.getElementById("sail-"+sailIndex)

            let divName   = document.getElementById(`sail-${sailIndex}-name`),
                divChange   = document.getElementById(`sail-${sailIndex}-change`),
                divDelete = document.getElementById(`sail-${sailIndex}-delete`),
                divSpecial= document.getElementById(`sail-${sailIndex}-special`)
                        
            divContainer.removeClass("speed-color");
            divContainer.removeClass("handle-color");
            divContainer.removeClass("weight-color");
            divContainer.removeClass("empty");
            switch (sailID){
                case 0:
                    divName.innerHTML = "empty"
                    divSpecial.addClass("hidden")
                    divDelete.addClass("hidden")
                    divContainer.addClass("empty");
                    break;
                case 1:
                    divName.innerHTML = "Speed Sail"
                    divSpecial.addClass("hidden")
                    divContainer.addClass("speed-color");
                    break;
                case 2:
                    divName.innerHTML = "Handling Sail"
                    divContainer.addClass("handle-color");
                    break;
                case 3:
                    divName.innerHTML = "Weight Sail"
                    divContainer.addClass("weight-color");
                    break;
            }
            sailIndex ++
    }

}
let calculatePercentWeight = ()=>{
    percentWeight = Math.round((currentWeight / maximumWeight) * 10000)/100
}

let currentValueCheck = ()=>{
    if(currentWeight>maximumWeight){
        currentWeight = maximumWeight
        currentWeightInput.value = currentWeight;
    }
}

let calculateCurrentWeight = ()=>{
    currentWeight = Math.round(percentWeight * maximumWeight/10)/10;
}

let calculateMaxWeight = ()=>{
    maximumWeight = 30000 + sailWgt + additionalWgt
}

let updateCurrentWgt = ()=>{
    calculatePercentWeight();
    weightPercentInput.value = percentWeight;    
}
let updatePercentWgt = ()=>{
    calculateCurrentWeight()
    currentWeightInput.value = currentWeight;
}

let updateMaxWgt = ()=>{
    calculateMaxWeight();
    currentValueCheck();
    maximumWeightInput.innerHTML = maximumWeight
    console.log("currentWeight",currentWeight)
}



function calculatePercentages(type){
    let bestSpeed = 0,
        bestPercentage,
        relPercentage,
        curMaxKnots
    
    sailWgt = 0; 

    for([sailID, special] of configArray){
        switch(sailID){
            case 1:
                bestSpeed += speedSail
                break;
            case 2:
                bestSpeed += (handleSail * (special/100))
                break;
            case 3:
                bestSpeed += weightSail
                sailWgt   += special/100 * 4000
                break
        }
    }
    
    if(type && type === "addWgt" || type === "sails"){
        updateMaxWgt();
    }
    updateCurrentWgt();



    
    // updateCurrentWgt();
    // updatePercentWgt();
    

    // weightChange()
    let maxSailConfigPercentage = bestSpeed/maxSpeed *100;
    
    curMaxKnots = ((maxSpeed * maxSailConfigPercentage/100) * (weightFactor * Math.sqrt(100 - percentWeight))/100)
    bestPercentage = curMaxKnots / bestSpeed * 100
    relPercentage = curMaxKnots / maxSpeed * 100

    calculateMaxKnot.innerHTML = `${Math.round(curMaxKnots*100)/100}kN`
    calculateMaxPercent.innerHTML = `${Math.round(bestPercentage*100)/100 ? Math.round(bestPercentage*100)/100:0}%`
    calculateRelPercent.innerHTML = `${Math.round(relPercentage*100)/100}%`
}

function openChangeModal(){
    changeSailModal.removeClass("hidden")
}
function closeChangeModal(){
    modalSelected ? modalSelected.removeClass("selected") : null
    modalSelected = null;
    changeSailModal.addClass("hidden")
}

function resetChangeModal(){
    modalSelected ? modalSelected.removeClass('selected') : null;
    modalSelected = null;
    
    modalSpecialInput ? modalInputContainer.addClass("hidden") : null;
    modalSpecialInput = false;
    
    modalInputValue.value = 100;
    sailModalInputValue = 100;

    currentCard = null;
}

function app(){

    //////////////// Sails ///////////////////
    

    let updateConfigList = (value)=>{
        if(value && value.id.includes("Main")){
            let type = value.id.replace("Main", "")
    
            switch (type){
                case "speed":
                    configArray = [[1,0],[1,0],[1,0],[1,0],[1,0],[1,0]]
                    break;
                case "handling":
                    configArray = [[2,100],[2,100],[2,100],[2,100],[2,100],[2,100]]
                    break;
                case "weight":
                    configArray = [[3,100],[3,100],[3,100],[3,100],[3,100],[3,100]]
                    break;
                default:
                    configArray = customConfig
            }
            prevSelected ? prevSelected.removeClass("selected"): null;
            value.addClass("selected")
            prevSelected = value
           
        }else{
            configArray = customConfig
        }
        loadSailConfig()
        calculatePercentages('sails');
    }


    let addSails = (e)=>{
        let target = e.target
        if(target === prevTarget) return
        
        prevTarget?prevTarget.classList.remove("selected"):null;
        target.classList.add("selected");
        
        updateConfigList(target)


    }



    let sailCardFunction = (e)=>{
        let cardID
        let change = false
     
        switch(true){
            case e.target.id.includes("change"):
                cardID = e.target.parentNode.parentNode.id.replace("sail-", "")
                currentCard = cardID
                openChangeModal()
                change = true
                break;
            case e.target.id.includes("delete"):
                cardID = e.target.parentNode.parentNode.id.replace("sail-", "")
                configArray[cardID] = [0,0]
                change = true
                calculatePercentages('sails');
                break;
            case e.target.id.includes("special"):
                cardID = e.target.parentNode.id.replace("sail-", "")
                change = true
                console.log('special')
                break;
        }
        
        customConfig = configArray;
        loadSailConfig()
        if(change){
            prevSelected.removeClass("selected");
            customButton.addClass("selected");
            prevSelected = customButton
        }
    }

    for(const element of configButtons ){
        element.addEventListener('mousedown', addSails)
    };

    sailItemContainer.addEventListener('mousedown', sailCardFunction)
    sailItemContainer.addEventListener('change', sailCardFunction)
    
    ///////////////// Sail Modal /////////////

    function modalMouseDownEventListener(e){
        let target = e.target
        let targetValue
        
        if(target.id.includes("Selection") && modalSelected !== target){
            modalSelected ? modalSelected.removeClass("selected"): null
            modalSelected = target
            target.addClass("selected")
        }

        switch(target.id){
            case "speedSelection":
                modalSpecialInput ? modalInputContainer.addClass("hidden") : null
                modalSpecialInput = false
                break;
            case "handlingSelection":
                !modalSpecialInput ? modalInputContainer.removeClass("hidden") : null
                modalSpecialInput = true
                modalInputTitle.innerHTML = "Sail Acceleration:"
                break;
            case "weightSelection":
                !modalSpecialInput ? modalInputContainer.removeClass("hidden") : null
                modalSpecialInput = true
                console.log("weight")
                modalInputTitle.innerHTML = "Max Move Weight:"
                break;
            case "closeModal":
                closeChangeModal();
                resetChangeModal()
                calculatePercentages();
                break;
            case "confirmModal":
                let type = modalSelected.id.replace("Selection", "")
                let sailID;
                let specialValue
                maxSpecialValue = type == "handling" ? 125 : 300;
                    
                    targetValue = modalInputValue.value
                    checkDecimalLength(targetValue) ? targetValue = sailModalInputValue  : null
                    targetValue > maxSpecialValue ? targetValue = maxSpecialValue : null
                    targetValue < 100 ? targetValue = 100  : null;
                    sailModalInputValue  = parseFloat(targetValue)
                
                switch(type){
                    case "speed":   
                        sailID = 1
                        specialValue = 0
                        break;
                    case "handling":
                        sailID = 2;
                        specialValue = sailModalInputValue
                        break;
                    case "weight":
                        sailID = 3;
                        specialValue = sailModalInputValue
                        break    
                }
                customConfig[currentCard] = [sailID, specialValue]
                updateConfigList()
                closeChangeModal()
                resetChangeModal()
                calculatePercentages('sails');
                break;
        }

        modalSelected ? modalConfirmButton.removeClass("hidden") : modalConfirmButton.addClass("hidden")
           
    }

    function modalChangeEventListener(e){
        if(e.target.id === "modalInputValue"){
            targetValue = e.target.value
            
            checkDecimalLength(e.target.value) ? e.target.value = sailModalInputValue  : null
            if(currentCard === "handle"){
                targetValue > 125 ? e.target.value = 125 : null
            }
            if(currentCard === "weight"){
                targetValue > 300 ? e.target.value = 300 : null
            }
            targetValue < 100 ? e.target.value = 100  : null;
            sailModalInputValue  = parseFloat(e.target.value)
        }
        
    }

    changeSailModal.addEventListener('mousedown', modalMouseDownEventListener)
    changeSailModal.addEventListener('change', modalChangeEventListener)

    ////////////////// Weight ///////////////

    

    

    let weightInputArray = [weightPercentInput, currentWeightInput]
    let weightInputFunction = (e)=>{
        let target = e.target
        let targetDecimalLengthCheck = target.value.split(".")[1] ? target.value.split(".")[1].length > 4 : false
        e.data === "-" || e.data === "+"? target.value = 0:null;
        target.value == "0" + e.data ? target.value = e.data : null
        let targetValue = parseFloat(target.value)
        // console.log(target);
       
        
        switch (target.id){
            case "weightPercent":
                checkDecimalLength(target.value) ? target.value = percentWeight : null
                targetValue > 100 ? target.value = percentWeight : null
                targetValue < 0 ? target.value = percentWeight : null;
                percentWeight = parseFloat(target.value)
                break;
            case "currentWeight":
                checkDecimalLength(target.value) ? target.value = currentWeight: null;
                targetValue > maximumWeight ? target.value = maximumWeight : null
                targetValue < 0 ? target.value = currentWeight : null;
                currentWeight = parseFloat(target.value)
                break;
            // case "maximumWeight":
            //     checkDecimalLength(target.value) ? target.value = maximumWeight : null;
            //     targetValue > 999999 ? target.value = maximumWeight : null
            //     targetValue < 0 ? target.value = maximumWeight : null;
            //     maximumWeight = parseFloat(target.value)
            //     break;  
        }
    }
    
    let weightChangeFunction = (e)=>{
        let target = e.target
        let targetValue = target.value
        console.log(target.id)
        switch (target.id){
            case "weightPercent":
                console.log(percentWeight)
                console.log(targetValue);
                updatePercentWgt();
                break;
            case "currentWeight":
                // if(targetValue > maximumWeight){
                //     currentWeight.value = maximumWeight;
                //     currentWeight = maximumWeight
                // };
                updateCurrentWgt();
                // weightChange()
                break;
        }
        calculatePercentages();
    }

    for(const weightInput of weightInputArray){
        weightInput.addEventListener('input', weightInputFunction)
        weightInput.addEventListener('change', weightChangeFunction)
    }

    /////////////////// Ship Spec //////////////// 
    let checkPointsInWgt = ()=>{
            if (pointsInWgt <= 0 ){
                wgtButtons[0].addClass("deactive")
            }else{
                wgtButtons[0].removeClass("deactive")
            }
            if(pointsInWgt >= 60){
                wgtButtons[1].addClass("deactive")
            }else{
                wgtButtons[1].removeClass("deactive")

            }
            additionalWgt = pointsInWgt * 600

            calculatePercentages("addWgt")
            additionalWgtValue.innerHTML = additionalWgt
            specWgtPoints.innerHTML = pointsInWgt
        }

    let shipMouseFunction = (e)=>{
        let target = e.target
        switch(target.id){
            case "specWgtDecreaseBtn":
                pointsInWgt = pointsInWgt > 0 ? pointsInWgt - 1 : 0;
                checkPointsInWgt();
            break;
            case "specWgtIncreaseBtn":
                pointsInWgt = pointsInWgt < 60 ? pointsInWgt + 1 : 60;
                checkPointsInWgt();
            break;
        }
    }

    
    
    // let maxSailSpeed,
    //     weightFactor;

    // maxSailSpeed = 26.40;
    // weightFactor = 10.189;

    // function getMaxSailSpeed(maxSailConfigPercentage, shipWeightPercentage){
    //     return (maxSailSpeed * maxSailConfigPercentage/100) * (weightFactor * Math.sqrt(100 - shipWeightPercentage))/100
    // };

    // console.log(getMaxSailSpeed(92.61,10));
    shipSpecContainer.addEventListener('mousedown', shipMouseFunction)
    
    // document.addEventListener('change', calculatePercentages)

}

function setContainers(){
    sailItemContainer   = document.getElementById("arrangementContainer")
    configButtons       = document.getElementsByClassName("sail-main-button")
    sailContainer       = document.getElementById("arrangementContainer");
    weightPercentInput  = document.getElementById("weightPercent");
    currentWeightInput  = document.getElementById("currentWeight");
    maximumWeightInput  = document.getElementById("maximumWeight");
    changeSailModal     = document.getElementById("changeSailModal");
    modalInputContainer = document.getElementById("modalInputContainer")
    modalInputTitle     = document.getElementById("modalInputTitle");
    modalInputValue     = document.getElementById("modalInputValue");
    modalConfirmButton  = document.getElementById("confirmModal");
    calculateMaxKnot    = document.getElementById("calculateValueKnots");
    calculateRelPercent = document.getElementById("calculateValueRelPer");
    calculateMaxPercent = document.getElementById("calculateValueMaxPer");
    customButton        = document.getElementById("customMain");
    wgtButtons          = document.getElementsByClassName("wgt-btn");
    shipSpecContainer   = document.getElementById("shipSpecContainer");
    specWgtPoints       = document.getElementById("specWgtPoints");
    additionalWgtValue      = document.getElementById("specWgtValue")
}
