const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-lengthNumber]");
const passwordDisplay= document.querySelector("[data-passworDisplay]");
const copyBtn= document.querySelector("[data-copy]");
const copyMsg= document.querySelector("[data-copyMsg]");
const uppercaseCheck= document.querySelector("#uppercase");
const lowercaseCheck= document.querySelector("#lowercase");
const numbersCheck= document.querySelector("#numbers");
const symbolsCheck= document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator");
const generateBtn= document.querySelector(".generateButton");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
// const refreshBtn=document.getElementById("btnRefresh");
//initially
let password="";
let passwordLength=10;
let checkCount=0;

handleSlider();
//set strength circle color to gray
setIndicator("#ccc");

//set password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
     indicator.style.backgroundColor=color;
     //shadow
     indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// //Refresh the page
// function handleClick(){
//   window.location.reload();
// }

// refreshBtn.addEventListener('click',handleClick);

function getRandomInteger(min,max){
    return Math.floor(Math.random() * (max-min)) +min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode( getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode( getRandomInteger(65,90));
}

function generateSymbol(){
    const randNum=getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent(){
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="Copied";
  } 
  catch (e) {
    copyMsg.innerText="Failed";
  }
  copyMsg.classList.add("active");
  setTimeout(()=>{
     copyMsg.classList.remove("active");
  },2000);
  
}


function shufflePassword(array){
  //fresher yates method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str; 
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
      if(checkbox.checked)
           checkCount++;
    });
    //condn
    if(passwordLength<checkCount){
      passwordLength=checkCount;
      handleSlider();
    }
}


allCheckBox.forEach((checkbox)=>{
  checkbox.addEventListener('change',handleCheckBoxChange);
})


//all event listner
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
  if(passwordDisplay.value)
      copyContent();
})

generateBtn.addEventListener('click', () =>{
      //NONE Of the box are selected
     
      if(checkCount==0) 
           return;

      if(passwordLength <checkCount){
        passwordLength = checkCount;
        handleSlider();
      }

      //let's start the journey to gen new password
      console.log("Starting the journey");
      //remove old password
      password="";

      //let's put the stuff mentioned by checkboxes
      // if(uppercaseCheck.checked){
      //   password+=generateUpperCase();
      // }

      // if(lowercaseCheck.checked){
      //   password+=generateLowerCase();
      // }

      // if(numbersCheck.checked){
      //   password+=generateRandomNumber();
      // }

      // if(symbolsCheck.checked){
      //   password+=generateSymbol();
      // }

      let funcArr = [];
      if(uppercaseCheck.checked){
           funcArr.push(generateUpperCase);
      }

      if(lowercaseCheck.checked){
           funcArr.push(generateLowerCase);
      }

      if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
      }

      if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
      }
      
      //compulsory addtion
      for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
      }
      console.log("Compulsory addition done");
      
      //ramaining addition
      for(let i=0 ;i<passwordLength-funcArr.length;i++){
        let randIndex=getRandomInteger(0,funcArr.length);
        console.log("randIndex " + randIndex);
        password+= funcArr[randIndex]();
      }
      console.log("Remaining addition done");
      //shuffle password;
      password=shufflePassword(Array.from(password));
      console.log("shuffling done")
      //show in UI
      passwordDisplay.value=password;
      console.log("UI addition done");
      //calc strength
      calcStrength();
});

window.addEventListener('beforeunload', function () {
  // Clear the content of the page
  clearPageContent();
});

function clearPageContent(){
  var inputField=document.querySelector("[data-passworDisplay]");
  if(inputField){
    inputField.value='';
  }
}

window.addEventListener('beforeunload', function(){
  removeHoverStyle();
})

function removeHoverStyle(){
  var checkedCheckboxes = document.querySelectorAll("input[type=checkbox:checked]");
  if(checkedCheckboxes){
    checkedCheckboxes.style.content='';
    checkedCheckboxes.style.color='';
  }
}