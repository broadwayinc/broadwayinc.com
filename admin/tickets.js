function addMore(event, key, type) {
    // element before the button
    let element = event.target.previousElementSibling;
    let keyInp = /*html*/ `
        <td>key</td>
        <td><input type="text" name="${key}[key]" /></td>
    `
    let valueInp = /*html*/ `
        <td>value</td>
        <td><input type="text" name="${key}[value]" /></td>
    `
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
    if (type === true) {
        add = [keyInp, valueInp, opInp, sv, im];
    }
    else if (type === 'key-value') {
        add = [keyInp, valueInp];
    }
    else {
        add = [keyInp, valueInp, opInp];
    }
    let table = document.createElement('table');
    for (let d of add) {
        let tr = document.createElement('tr');
        tr.innerHTML = d;
        table.appendChild(tr);
    }
    element.parentNode.insertBefore(table, event.target);
}