const rules = () => ({
  rules: {
    quotes: {
      ".read": true,
      $quote: {
        ".write": (
          `auth !== null && (
            (
                newData.hasChildren(['quote', 'votes']) &&
                newData.child('quote').hasChildren(['body', 'author', 'posted_by'])
            ) 
            ||
            (
                newData.hasChildren(['votes']) && 
                newData.child('votes').hasChildren(['count', 'voters']) &&
                data.hasChild('quote')
             )
        )`
        ),
        quote: {
          ".validate": "!data.exists()",
          body: {
            ".validate": "newData.isString() && !data.exists()"
          },
          author: {
            ".validate": "newData.isString() && !data.exists()"
          },
          posted_by: {
            ".validate": "newData.val() === auth.uid"
          },
          $other: {
            ".validate": false
          }
        },
        votes: {
          count: {
            ".validate": (
              `
            (!data.exists() && newData.val() === 0) ||
            (data.exists() && (newData.val() === data.val() + 1) || (newData.val() === data.val() - 1))
            `
            )
          },
          voters: {
            $uid: {
              ".validate": "newData.val() === true"
            }
          },
          $other: {
            ".validate": false
          }
        },
        $other: { ".validate": false }
      }
    }
  }
});

module.exports = rules;
