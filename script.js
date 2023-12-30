
 const userTab=document.querySelector("[data-userWeather]");

 const searchTab=document.querySelector("[data-searchWeather]");

 const userContainer=document.querySelector(".weather-container");

 const grantAccesContainer=document.querySelector(".grant-location-container");

 const searchForm=document.querySelector("[data-searchForm]");


 const loadingScreen=document.querySelector(".loading-container");

 const userInfoContainer=document.querySelector(".user-info-container");

 const er=document.querySelector(".error");


 // Initially variables need

 let oldTab=userTab; 
const API_KEY = "168771779c71f3d64106d8a88376808a";

oldTab.classList.add("current-tab");

getfromSessionStorage();

userTab.addEventListener('click',()=>
{
    er.classList.remove("active");
})
searchForm.addEventListener('click',()=>
{
    er.classList.remove("active");
})

function switchTab(newTab)
{
    if(newTab!=oldTab)
    {
       
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            // inorder to display searchform
            userInfoContainer.classList.remove("active");
            grantAccesContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else
        {
            // inorder to display Your weather tab
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            
            // checking local storage for coordinate

             getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click',()=>
{
    
    switchTab(userTab)
})


searchTab.addEventListener('click',()=>
{
    
    switchTab(searchTab)
})

 // checking for coordinate in local  storage
function getfromSessionStorage()
{
  const localCoordinates=sessionStorage.getItem("user-coordinates");
  if(!localCoordinates)
  {
    // Local coordinates nahi ha 
     grantAccesContainer.classList.add("active");
  }
  else
  {
    const coordinates=JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates); 
  }
}


async function fetchUserWeatherInfo(coordinates)
{
    const {lat,lon}=coordinates;
     
    //make grant container invisibe
    grantAccesContainer.classList.remove("active");

    //make loader container visibe
    loadingScreen.classList.add("active");

    //API  calls

    try{
        const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
         
        const data=await res.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);
    }
    catch(err)
    {
         loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(data)
{
    // firstly we have to fetch the element

    const cityName=document.querySelector("[data-cityName]");

    const countryIcon=document.querySelector("[data-countryIcon]");

    const desc=document.querySelector("[data-weatherDesc]");

    const weatherIcon=document.querySelector("[data-weatherIcon]");

    const temp=document.querySelector("[data-temp]");

    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");
    
    // fetch value from weather info object

    cityName.textContent=data?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;

    desc.innerText = data?.weather?.[0]?.description;

    weatherIcon.src= `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;

    temp.innerText= `${data?.main?.temp.toFixed(2)} °C`;

    windspeed.innerText=`${data?.wind?.speed} m/s`;

    humidity.innerText=`${data?.main?.humidity} %`;

    cloudiness.innerText=`${data?.clouds?.all} %`; 
}


function getLocation()
{
    if(navigator.geolocation)
    {
        // calling geolocation API
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else
    {
        alert("Grant the permission");
    }
}

function showPosition(position)
{
      const userCoordinates={
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }

      sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));

      fetchUserWeatherInfo(userCoordinates);
}


const grantAccesButton=document.querySelector("[data-grantAccess]");

grantAccesButton.addEventListener('click',getLocation);



const searchInput=document.querySelector("[ data-searchInput]");

searchForm.addEventListener('submit',(e)=>
{
    e.preventDefault();

    let cityName=searchInput.value;

    if(cityName==="")
    {
      return;
    }
    else
    {
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city)
{
      
    loadingScreen.classList.add("active");
    grantAccesContainer.classList.remove("active")

    try{

        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
         
        const data=await response.json();
        
       if(`${data?.name}`==="undefined")
        {
            throw new Error();
        }
        
        else
        {
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        }
    }

    catch(err)
    {
        userInfoContainer.classList.remove("active");
        loadingScreen.classList.remove("active");
        er.classList.add("active");
    }
}
