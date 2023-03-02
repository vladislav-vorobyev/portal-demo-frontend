/**
 * Procedure to check periodically and to update my user data that depends on authenticated user
 */
export default function ({ $auth, $portalApi, $myUserData }) {
  if (!process.server) {
    const getUserInfo = () => {
      if ($auth.user) {
        // if user is changed
        if ($auth.user.sub !== $myUserData.uid) {
          // reset my user data to empty
          $myUserData.set()
        }
        // get my user info
        if (!$myUserData.id) {
          $portalApi
            .get('/um/me')
            .then((result) => {
              if (result.data?.uid) {
                // update my user data
                $myUserData.set(result.data)
                // console.log('me:', $myUserData.uid, $myUserData.displayName)
              } else {
                // reset my user data to empty
                $myUserData.set()
              }
              // next check
              setTimeout(getUserInfo, 5000)
            })
            // eslint-disable-next-line no-console
            .catch((err) => console.error(err))
          // do not repeat check on fail
          return
        }
      } else {
        // reset my user data to empty
        $myUserData.set()
      }
      setTimeout(getUserInfo, 1000)
    }
    // start the proccess
    getUserInfo()
  }
}
