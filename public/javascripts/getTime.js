

function display_c()
{
    mytime=setTimeout('display_ct()',1000)
}

function display_ct() 
{
    var newTime = new Date();
    const setTime=document.querySelector(".getTime");
    // setTime.innerHTML = newTime;
    newTime=newTime.toUTCString();
    newTime=newTime.substring(4,16);
    setTime.innerHTML = newTime;
    console.log(newTime);
    display_c();
}