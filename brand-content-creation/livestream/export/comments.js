/* What the rail shows when nothing is pushing to it. Edit this file and hit
   Refresh on the Browser Source.

   It is a .js file rather than .json on purpose: a page opened from file://
   cannot fetch() a sibling file — Chrome and OBS's embedded browser both
   block it as a cross-origin read — but a <script> tag loads fine.

   Fields: who (required), text (required), promoted, member. */
window.NSDS_COMMENTS = [
  { who: "@dev_arun",  text: "wait, so the loop is the problem?" },
  { who: "@meera_dt",  text: "this is the clearest explanation yet", member: true },
  { who: "@sana_k",    text: "following along in a scratch org" },
  { who: "@priya_dev", text: "does this apply to scheduled Flows too?", promoted: true },
];
