const form = document.querySelector('#updateForm')
    form.addEventListener('change', () => {
        const updateButton = document.querySelector('button')
        updateButton.removeAttribute('disabled')
    })