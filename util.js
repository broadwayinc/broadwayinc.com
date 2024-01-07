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