# Hackbrunel Checkin

The check-in / check-out tool that was used for HackBrunel V2 (in-person), built upon the ti.to api.
Designed to be easily accessible on mobile phones for staff and can be quickly hosted on a service like repl.it or Vercel. (Or your own hosting solution if you prefer.)

## Setup
Rename ``.env.example`` to ``.env`` and fill in the details from your ti.to listing for the event, and the API token.
**Some parts may not work with a test mode token! Make sure when deploying that you use the live token.**

The ``.env`` file is also where you can change the colours (in hex format).

To replace the logo, simply replace the ``event-graphic.png`` file in the ``public`` folder.

You'll also need to make sure the following custom slugs are set on the tito website for these questions:
 - University / College name: ``university``
 - Study Level: ``study-level``

## Notes
This webapp can currently only support one check in list. While this worked great for us, if you need this you'll need to integrate the functionality yourself if you wish to have multiple (i.e different lists per ticket).

This tool is definitely deserving of a re-write, but it'll likely only come about if we, or a different team get round to doing V3.


## Important Info
This tool comes with absolutely no warranty, and is provided as-is. If you find any bugs, please feel free to open an issue or a pull request. We trust you'll test if this is suitable for your event before using it in a live environment.
