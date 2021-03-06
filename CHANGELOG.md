# Rainbird Release Notes

The internal set of release notes. Please update the `unreleased` section with
each change you do. On release we'll create a new version and update the public
facing release notes.

## Example

  *  [New] A new feature
  *  [Fix] A bug fix
  * [Misc] Other items

## v2.37.0
  * [Fix]  RB-4050: Update vulnerable packages.

## v2.28.0
  * [Fix]  RB-1527: fix missing skip functionality

## v2.27.0

  * [Fix]  RB-3258: low severity security vulnerability detected in superagent <3.7.0 defined in package.json.

## v2.24.0

  * [Fix]  RB-1712: Prevent Chirpy from continuously auto-starting.

## v2.23.0

  * [Misc] RB-3192: Added basic Google analytics - page view tracking.
  * [Misc] RB-3150 Removed unused dependency express-session.

## v2.21.0

  * [Misc] RB-1604: Removed Hoek vulnerability by updating Request library.

## v2.19.0

  * [Fix] RB-1448: Only display the opening placeholder when there is a choice of goals to run.
  * [Fix] RB-1302: Chat agent does not 'reset' if it encounters an error.

## v2.18.0

  * [Fix] RB-1504: Fix missing icons.
  * [Fix] RB-1449: Update jquery-ui.
  * [Fix] RB-1433: Fix Chat Agent missing css and jquery dependencies.

## v2.17.0

  * [New] RB-1375: Automatically start if only single query and hide query buttons depending on configuration.

## v2.16.0

  * [Misc] RB-1367: Update ejs version due to vulnerability.

## v2.14.0

  * [Misc] RB-1312: Move how chirpy-ui is installed from bower to npm.
  * [Misc] RB-1090: Updated readme, added server.js to help getting started & updated the testServer.

## v2.13.1

  *  [Fix] RB-1285: Fix date format.

## v2.13.0

  *  [Fix] RB-1251: Allow yes/no autocomplete.
  * [Misc] RB-1262: Allow %C to be used in answer text for certainty.

## v2.12.0

  * [Misc] RB-1233: Update component links in order to serve from rainbird-applications.
  *  [New] RB-1186: Restrict selection in second form questions for a plural false relationship when KM facts exist.

## v2.11.0

  *  [Fix] RB-1189: Fix evidence tree pointing to wrong place.

## v2.6.0

  *  [Fix] RB-878: Fix display on Firefox.

## v2.5.0

  *  [Fix] RB-875: Fix Chirpy Agent not using new getSessionID

## v1.1.3

  *  [New] TRIN-170: Updates to support migration of agents and goals.

## v1.1.2

  *  [Fix] RB-736: Fix number restriction not lifting if end of the session

## v1.1.1

  * [Misc] Fix github tag

## v1.1.0

  *  [Fix] RB-597: Change why analysis icon

## v1.0.7

  *  [Fix] RB-697: Fix number input restriction staying

## v1.0.6

  *  [Fix] RB-588: Change wording of goal hint

## v1.0.5

  *  [Fix] RB-716: Add calendar icon
  *  [Fix] RB-697: Add restriction to number questions
  *  [Fix] RB-553: Fix canAdd not always working as expected
  *  [Fix] RB-588: Add hint on how to start an interaction

## v1.0.4

  *  [Fix] RB-692: Set focus to user input on load
  *  [Fix] RB-690: Fix long goal descriptions being overlapped by reset button
  *  [Fix] RB-691: Stop date picking showing automatically
  *  [Fix] RB-675: Fix unspecified second form object questions asking the wrong question
  *  [Fix] RB-638: Fix send button being clickable at wrong time
  *  [Fix] RB-677: Fix singular questions highlighting multiple response buttons if the text matched
  *  [Fix] RB-676: Change primary colours

## v1.0.3

  *  [Fix] RB-661: Improve manual date entry
  *  [Fix] RB-660: Auto show date picker
  *  [Fix] RB-669: Fix layout issue
  *  [Fix] RB-670: Fix second form subject questions not always being answered correctly

## v1.0.1

  *  [Fix] RB-639: Add reset button and header
  *  [Fix] RB-619: Limit number of response buttons shown
  *  [Fix] RB-645: Fix box layout occasional overlap
  *  [Fix] RB-632: Remove initial dialogue line

## v1.0.0

  *  [Fix] RB-618: Add unknown support
  *  [Fix] RB-553: Add canAdd functionality, stop enter button being usable when userInput is blank.
  *  [Fix] RB-604: Improve enter button functionality
  *  [Fix] RB-612: Fix goal text being ignored
  * [Misc] Release

## v0.0.13

  * [Misc] RB-58*: Add animations to be less jumpy, new layout for better UX
  *  [Fix] RB-586: Remove API key from front end.

## v0.0.1

  *  [New] Project seed
