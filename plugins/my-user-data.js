import Vue from 'vue'

export default function ({ app }, inject) {
  const userData = Vue.observable({ id: 0, uid: '', displayName: '', photo: '' })

  userData.set = function (data) {
    userData.id = data?.id ?? 0
    userData.uid = data?.uid ?? ''
    userData.displayName = data?.display_name ?? ''
    userData.photo = data?.photo ?? ''
  }

  inject('myUserData', userData)
}
