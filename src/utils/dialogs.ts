import Swal from 'sweetalert2'

const base = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: 'tb-swal',
    confirmButton: 'btn btn-primary ms-2',
    cancelButton: 'btn btn-outline-secondary',
    denyButton: 'btn btn-outline-secondary',
  },
})

interface ConfirmOptions {
  title: string
  text?: string
  confirmText?: string
  danger?: boolean
}

export async function confirmAction({ title, text, confirmText = 'Continue', danger = false }: ConfirmOptions) {
  const res = await base.fire({
    title,
    text,
    icon: danger ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'tb-swal',
      confirmButton: danger ? 'btn btn-danger ms-2' : 'btn btn-primary ms-2',
      cancelButton: 'btn btn-outline-secondary',
    },
  })
  return res.isConfirmed
}

export function showSuccess(title: string, text?: string) {
  return base.fire({ title, text, icon: 'success', confirmButtonText: 'OK' })
}
