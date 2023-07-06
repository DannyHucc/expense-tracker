'use strict'

const form = document.querySelector('.info-form')
const backBtn = document.querySelector('.btn-back')
const saveBtn = document.querySelector('.btn-save')

function clickSaveBtn() {
    form.classList.add('was-validated')
}

function sweetAlert(event) {
    event.preventDefault()
    swal({
        title: "Are you sure to return to the homepage?",
        icon: "warning",
        text: "Unsaved data will disappear after leaving the page",
        buttons: true,
        dangerMode: true
    }).then(check => {
        if (check) {
            window.location.href = "../"
        }
    })
}

saveBtn.addEventListener('click', clickSaveBtn)
backBtn.addEventListener('click', sweetAlert)