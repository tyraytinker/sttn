The box travels with STTN. In the room it becomes the network.

One machine. No uplink. Phones join it and get a website that only exists here. A printer is attached to the same machine.

It is venue gear. PA, lights, door, this.

See [[Space]] for the contract. See [[Closed Box Model]] for the full technical model. This note is how the contract is kept.

---

## Closed

WAN unplugged. Firewall: no forward, no NAT. Nothing on this machine routes to the internet.

A visible status: closed. If the lamp is dark, the night is lying.

Disk stays with STTN between events. Disk encryption, so a stolen box is not an open archive.

The box guarantees STTN does not leak, train, or advertise. It does not police a camera. Say that at the door. Do not pretend otherwise.

## How a phone gets in

No app. The box has no internet; an App Store build cannot be the door.

The box runs the radio (or sits behind a travel router in AP mode). DHCP and DNS point every name at itself. Captive portal: the phone’s “Sign in to network” sheet *is* the site.

HTTP only. A real certificate needs the public internet.

Fallback printed on a card: `http://10.0.0.1`.

Phones will try to use cellular when they smell no internet. The site must never depend on a public domain they will fetch off-LAN. If the sheet fails, the IP on the card.

## Two content classes

One web app. Two drops.

**Floor.** Anyone on the network. Photograph from the camera roll, onto tonight’s wall. View. Print. No download. No files folder.

**Artists.** One night code, not accounts. Unlocks a drop: compressed audio to stream in the room, stills and flyers to view and print. Playback, not a zip of the set. No download.

No ranking. No likes. No comments. Operator can delete.

## Nights on disk

Each event is a folder. Tonight is the only folder the public app mounts.

```
/data/events/2026-08-27-venue/
  photos/
  artists/<id>/audio
  artists/<id>/stills
  meta.json
```

Operator, on a staff phone or a laptop on the same network: start tonight, kill a photo, watch the printer queue, attach another folder read-only — open a past night on purpose. Pack-out is power off. Next event, new folder. Old nights stay closed until opened in a room.

## Print

CUPS on the box. USB or LAN to the printer. The job is a button on the phone; the object lands at the station.

Someone has to unjam it. That is a role.

Paper is the sanctioned copy. The file does not go home.
