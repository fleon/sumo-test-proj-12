
var token;
declare var firebase: any

type Dictionary<T> = { [key: string]: T }

function forEach<T>(
  obj: T[] | Dictionary<T>,
  callback: (value: T, key: string | number, obj: T[] | Dictionary<T>) => boolean | void
) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (callback(obj[i], i, obj)) {
        break
      }
    }
  } else {
    for (let i = 0, keys = Object.keys(obj); i < keys.length; i++) {
      if (callback(obj[keys[i]], keys[i], obj)) {
        break
      }
    }
  }
}

let loggedInUser;

let request = Object.assign((endpoint: string, params: Dictionary<string> = {}) => {
  forEach(params, (value, key) => {
    endpoint = endpoint.replace(':' + key as string, value || '')
  })
  return fetch(endpoint, request._options).then((response) => {
    return response
  })
},
  {
    _options: {},
    options(params) {
      request._options = params
    }
  })


function loginWithGoogle() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      loggedInUser = user
      loggedInUser.getIdToken().then(idToken => {
        request.options({ headers: { 'Authorization': `Bearer ${idToken}` } })
      })
    } else {
      // Start a sign in process for an unauthenticated user.
      var provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('profile')
      provider.addScope('email')
      firebase.auth().signInWithRedirect(provider)
    }
  })
}

function fetchUsers() {
  request('/users').then(() => {
    debugger
  })
}
