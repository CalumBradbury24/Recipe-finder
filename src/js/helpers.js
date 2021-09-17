import { TIMEOUT_SECONDS } from './config';

const timeout = function () {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${TIMEOUT_SECONDS} second`));
        }, TIMEOUT_SECONDS * 1000);
    });
};

export const getJSON = async(url) => {
    try{
        const res = await Promise.race([fetch(url), timeout()]); //Promise.race resolves as soon as one of the promises settles (which ever resolves/rejects first)
        const data = await res.json() //Fetch doesnt automatically parse json into a javascript object 
    
        if(!res.ok) throw new Error(`${data.message} (${res.status})`) //If request is unsuccessful

        return data;
    } catch(err){
        throw err; //Causes this promise (from getJSON function) to reject
    }
}

export const sendJSON = async(url, uploadData) => {
    try{
        const fetchPromise = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(uploadData) //Axios does this JSON parsing automatically
        });

        const res = await Promise.race([fetch(url), timeout()]); //Promise.race resolves as soon as one of the promises settles (which ever resolves/rejects first)
        const data = await res.json() //Fetch doesnt automatically parse json into a javascript object 
    
        if(!res.ok) throw new Error(`${data.message} (${res.status})`) //If request is unsuccessful

        return data;
    } catch(err){
        throw err; //Causes this promise (from getJSON function) to reject
    }
}