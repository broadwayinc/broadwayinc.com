// random string generator
function randomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function changeType(event, rand) {
    let input = document.getElementById(rand);
    let newInput = document.createElement('input');
    newInput.required = true;
    newInput.id = rand;
    newInput.type = event.target.value;
    newInput.name = input.name;
    newInput.required = true;
    input.replaceWith(newInput);
}

function addMore(event, key, type) {
    // element before the button
    let element = event.target.previousElementSibling;
    let keyInp = /*html*/ `
        <td>key</td>
        <td><input type="text" name="${key}[key]" required/></td>
    `
    let valueInp = /*html*/ `
        <td>value</td>
        <td><input type="text" name="${key}[value]" required/></td>
    `
    
    let typeInpGen = ()=>{
        let rand = randomString(5);
        return /*html*/ `
            <td>value</td>
            <td style="display:flex;align-items:center;justify-content:space-between;width:100%;box-sizing: border-box;"><input type="text" id="${rand}" name="${key}[value]" required/>
            <select style="margin-left:4px;" value="text" onchange="changeType(event, '${rand}')">
                <option value="text">String</option>
                <option value="number">Number</option>
                <option value="checkbox">Boolean</option>
            </select>
        </td>
        `
    }

    let opInp = /*html*/ `
        <td>operator</td>
        <td>
            <select name="${key}[operator]">
                <option value="=">=</option>
                <option value=">">></option>
                <option value="<"><</option>
                <option value=">=">>=</option>
                <option value="<="><=</option>
            </select>
        </td>
    `

    let sv = /*html*/ `
        <td>setValueWhenMatch</td>
        <td><input type="text" name="${key}[setValueWhenMatch]" /></td>
    `
    let im = /*html*/ `
        <td>ignoreMismatch</td>
        <td><input type="checkbox" name="${key}[ignoreMismatch]" value='true'/></td>
    `

    let add = []
    if (type === 'match') {
        add = [keyInp, valueInp, opInp, sv, im];
    }
    else if (type === 'key-value') {
        add = [keyInp, valueInp];
    }
    else if (type === 'key-value-type') {
        add = [keyInp, typeInpGen()];
    }
    else if (type === 'value') {
        add = [valueInp, opInp];
    }
    else {
        add = [keyInp, valueInp, opInp];
    }
    for (let d of add) {
        let tr = document.createElement('tr');
        tr.innerHTML = d;
        event.target.previousElementSibling.appendChild(tr);
    }
}