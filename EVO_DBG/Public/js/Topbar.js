function setCounter(target, count){
    let counterContainer = target.getElementsByClassName('topbar_counter')[0];
    if(!counterContainer){
        counterContainer = document.createElement('span');
        counterContainer.classList.add('topbar_counter');
        target.appendChild(counterContainer);
    }

    if(!count){
        counterContainer.remove();
    }else{
        counterContainer.innerText =count;
    }
}