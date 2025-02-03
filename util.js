function disableForm(form) {
    form.querySelectorAll('input').forEach(input => {
        input.disabled = true;
    })
}

function enableForm(form) {
    form.querySelectorAll('input').forEach(input => {
        input.disabled = false;
    })
}

let _loaderId;
function runLoader(loading_text_el) {
    if (_loaderId) {
        clearInterval(_loaderId);
    }
    let text_array = [".", "..", "...", ""];
    let index = 0;
    loading_text_el.hidden = false;
    _loaderId = setInterval(() => {
        loading_text_el.textContent = text_array[index];
        index = (index + 1) % text_array.length;
    }, 250);
}

function stopLoader(loading_text_el, callback) {
    clearInterval(_loaderId);
    loading_text_el.hidden = true;
    if (typeof callback === "function") {
        callback();
    }
}