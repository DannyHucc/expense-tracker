'use strict'

const tables = document.querySelector('.record-tables')

function sweetAlert(event) {
    const target = event.target
    if ((target.matches('.btn-delete')) || (target.matches('.fa-trash-can'))) {
        event.preventDefault()
        swal({
            title: "Are you sure to delete the data?",
            icon: "warning",
            text: "Deleted data cannot be recovered",
            buttons: true,
            dangerMode: true
        }).then(check => {
            if (check) {
                const id = target.dataset.id
                console.log(id)
                document.querySelector(`.form-${id}`).submit()
            }
        })
    }
}

tables.addEventListener('click', sweetAlert)