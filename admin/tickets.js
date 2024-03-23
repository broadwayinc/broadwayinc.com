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

function addOrValue(event, key, placeholder = '') {
    let inp = /*html*/ `
        <td>...OR</td>
        <td><input type="text" name="${key}" placeholder="${placeholder}"/></td>
    `
    let tr = document.createElement('tr');
    tr.innerHTML = inp;
    event.target.previousElementSibling.appendChild(tr);
}

function tabIndent(e, _this) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = _this.selectionStart;
        const end = _this.selectionEnd;

        // Set textarea value to: text before caret + tab + text after caret
        _this.value = _this.value.substring(0, start) + "\t" + _this.value.substring(end);

        // Put caret at right position again (after the tab)
        _this.selectionStart = _this.selectionEnd = start + 1;
    }
    if (e.key === 'Enter') {
        e.preventDefault();
        const start = _this.selectionStart;
        const end = _this.selectionEnd;
        const lines = _this.value.substr(0, start).split("\n");
        const currentLine = lines[lines.length - 1];
        const indentMatch = currentLine.match(/^\s*/);
        const indent = indentMatch ? indentMatch[0] : '';

        // Set textarea value to: text before caret + newline + indent + text after caret
        _this.value = _this.value.substring(0, start) + "\n" + indent + _this.value.substring(end);

        // Adjust the caret position
        _this.selectionStart = _this.selectionEnd = start + 1 + indent.length;
    }
}

function addMore(event, key, params) {
    let {
        typed = false,
        replace_option = false,
        placeholder = '',
        operator = true
    } = params || {};

    let keyInp = /*html*/ `
        <td>Key</td>
        <td><input type="text" name="${key}[key]" placeholder="Key Name"/></td>
    `
    let valueInp = /*html*/ `
        <td>Value</td>
        <td><input type="text" name="${key}[value]" placeholder="${placeholder}"/></td>
    `

    let typeInpGen = (keyName = 'value', label = 'Value') => {
        let rand = randomString(5);
        return /*html*/ `
            <td>${label}</td>
            <td style="display:flex;align-items:center;justify-content:space-between;width:100%;box-sizing: border-box;">
                <input type="text" id="${rand}" name="${key}[${keyName}]" placeholder="${placeholder}"/>
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

    let add = [keyInp, operator ? opInp : '', typed ? typeInpGen() : valueInp, replace_option ? typeInpGen('setValueWhenMatch', 'Replace value') : ''];
    for (let d of add) {
        if (!d) continue;
        let tr = document.createElement('tr');
        tr.innerHTML = d;
        event.target.previousElementSibling.appendChild(tr);
    }
    let tr = document.createElement('tr');
    tr.innerHTML = /*html*/ `
        <td style="background-color: transparent"> </td>
        <td style="background-color: transparent;">
        <button type="button" class='removeButton' style='float: right;' onclick="remove(event)">Remove</button></td>
    `;
    event.target.previousElementSibling.appendChild(tr);
}

function remove(event) {
    let toRemove = [event.target.parentElement.parentElement];
    let parentTr = event.target.parentElement.parentElement.previousElementSibling;

    while (parentTr?.textContent && parentTr.textContent.trim() !== 'Remove') {
        if (parentTr) {
            toRemove.push(parentTr);
        }
        parentTr = parentTr.previousElementSibling;
    }
    for (let tr of toRemove) {
        tr.remove();
    }
}

function checkParams(params, struct, required = [], _parentKey = null) {
    function isObjectWithKeys(obj) {
        return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length;
    }
    function isArrayWithValues(arr) {
        return Array.isArray(arr) && arr.length;
    }
    if (_parentKey === null && !isObjectWithKeys(struct)) {
        throw 'Argument "struct" is required.';
    }
    let invalid_in = _parentKey !== null ? ` in key "${_parentKey}" is invalid.` : '. Parameter should be type <object>.';

    if (isArrayWithValues(struct)) {
        let should_be = struct.map(s => (['string', 'number', 'boolean', 'object', 'array'].includes(s) ? `Type<${s}>` : JSON.stringify(s, null, 2))).join(' or ');
        let pass = false;
        let val;
        for (let s of struct) {
            try {
                val = checkParams(params, s, required, _parentKey);
                pass = true;
                break;
            }
            catch (err) {
                pass = false;
            }
        }
        if (!pass) {
            throw `Invalid type "${typeof params}"${invalid_in} Should be: ${should_be}`
        }
        return val;
    }
    if (isObjectWithKeys(params)) {
        if (isObjectWithKeys(struct)) {
            for (let k in struct) {
                // scan defaults
                let key = (_parentKey === null ? '' : _parentKey) + (_parentKey !== null ? '[' + k + ']' : k);

                if (!params.hasOwnProperty(k)) {
                    if (required.includes(key)) {
                        throw `Key "${key}" is required.`;
                    }

                    if (isArrayWithValues(struct[k]) && typeof struct[k][struct[k].length - 1] === 'function') {
                        params[k] = struct[k][struct[k].length - 1]();
                    }
                }
            }
        }

        if ('object' === struct) {
            return params
        }

        else if (typeof struct === 'function') {
            return struct(params);
        }

        for (let k in params) {
            let parentKey = (_parentKey === null ? '' : _parentKey) + (_parentKey !== null ? '[' + k + ']' : k);
            if (!isArrayWithValues(struct) && !struct.hasOwnProperty(k)) {
                // throw `Key name "${parentKey}" is invalid in parameter.`;
                continue;
            }
            if (isArrayWithValues(params[k])) {
                if (struct[k] === 'array') {
                    continue;
                }
                if (typeof struct[k] === 'function') {
                    params[k] = struct[k](params[k]);
                    continue;
                }
                for (let i = 0; i < params[k].length; i++) {
                    params[k][i] = checkParams(params[k][i], struct[k], required, parentKey + `[${i}]`);
                }
            }
            else {
                params[k] = checkParams(params[k], struct[k], required, parentKey);
            }
        }
        return params;
    }
    if (typeof struct === 'function') {
        return struct(params);
    }
    if (struct === 'array' && Array.isArray(params) || struct === typeof params || params === struct) {
        return params;
    }
    function isEmptyObject(obj) {
        return obj && typeof obj === 'object' && !Array.isArray(obj) && !Object.keys(obj).length;
    }
    if (params === null || params === undefined || isEmptyObject(params)) {
        return params;
    }
    throw `Invalid type "${typeof params}"${invalid_in} Should be: ${(['string', 'number', 'boolean', 'object', 'array'].includes(struct) ? `Type<${struct}>` : JSON.stringify(struct, null, 2))}`;
}