---
title: i accidentally gave myself a second job
date: 2026-10-15
summary: a one-year reflection on hosting a media server for my friends and family
---

this past tuesday, my home server celebrated its first anniversary.

last year during my senior year of college, i had the privilege to live with five of my close friends in a house off-campus, and it was pretty common to find multiple of us on a given night sitting on one of the multiple couches in our living room watching tv.

one gripe ive always had with streaming services is that everything is scattered all over the place. sometimes the show you want to watch is on netflix, and then you check again a different time and its on hulu. other times you wanna watch a movie only to realize its in a shitty quality, not available without using a vpn to some random country, or its nowhere on streaming at all.

so after seeing an increasing amount of content regarding hosting your own media server on my youtube feed, i decided to put my computer science degree to an actual application and began creating what would later become an obsessive hobby.

### starting the server

when i first started out, i had no idea what i was doing. like seriously, for someone who had gone through three years of computer science at that point, i had never used a docker container or anything remotely related to what i was planning on building. so i was going in pretty blind except for the documentation online and video tutorials people had thankfully made.

one thing that we did as a household was movie nights on tuesdays, so it was important to me that we had a way to watch those movies in high quality and get it playing instantly (we would watch at like 9 PM so starting on time was important). i remember dabbling at first with hooking my laptop up to the tv with an hdmi cord or perhaps using my portable usb drive but our amazon tv was kind of ass at playing usb content (i probably set it up incorrectly but whatever).

i then discovered plex and jellyfin and realized that would be a much easier method of getting our movies playing on the tv, especially since we had good internet and my pc was right upstairs. i decided to go with jellyfin for its open-source nature, and got it all set up for movie nights. this would then be added onto with jellyseerr so that my friends could request movies, and from there the server (which i had decided to call [navi, after the pc from serial experiments lain](https://lain.fandom.com/wiki/Navi)) had started to take off.

### navi's growth

i dont remember the exact timeline after that point, but i know that i had done a full linux rebuild and server refresh during christmas break, from which point on i realized how much more i could do with navi, and came back in the spring semester ready to build something big.

march was the first date i have in my notes of the first official rebuild of my system, where after having a manual download process for requested movies from my friends, i implemented a sonarr/radarr/prowlarr/qbittorrent pipeline. this way, when one of my friends requested a movie or tv show, it would go straight from jellyseerr to jellyfin in one easy process.

a few days after that pipeline was established, i discovered [navidrome](https://www.navidrome.org/) (for music) and [audiobookshelf](https://audiobookshelf.org/) (for books and audiobooks). there is a lot of music that i enjoy that is not on streaming services anymore due to artist restrictions, and numerous audiobooks from when i was a child that i wanted to collect again, so i created those two services to house those lost items.

not a month later, i found [immich](https://immich.app/) as i had wanted a way to store my thousands of photos in something that i didnt have to pay for (fuck you icloud) but could still access from my other devices. and to top the stack off, in may i added [komga](https://komga.org/) for hosting manga and comics, [pingvin](https://github.com/stonith404/pingvin-share) as a way to share files and other things between my friends aside from airdrop, and [forgejo](https://forgejo.org/) as a way to host my own git projects.

### more than just a small hobby

by this point i had graduated college. my friends and i had all moved out of the house and were back in our respective states. i took a break from doing any kind of work to spend with my family. and i had started full time work at the start of june. i kind of stopped working on navi for a while to get my footing as a crm dev in the real world and learn as much as i could to get settled.

as the months went by, the server was still up and running but it was a mishmash of services that i had kinda plugged together, and the frontend was messy for sure. my friends had to go to different websites to access the services they needed but i wanted something that was easy to use, something seamless and pain-free.

during the month of august i decided to sit down and make this plan a reality. i first went out and bought a new domain (the .com version of the existing .me site i owned was now available, so i had to switch), set up [authelia](https://www.authelia.com/) for individual accounts based on email addresses, set up everything with cloudflare access, and created a cloudflare tunnel so nothing got port-forwarded.

on top of this new security layer, i, being the type of person who loves to customize everything *exactly* to how i want it, scrapped glance's dashboard and config and used my web dev experience to create two new dashboards with [go](https://go.dev/) and [htmx](https://htmx.org/), one for myself to monitor stuff like gpu and cpu temps and whos requesting what, and one for my friends. this new dashboard they had access to would allow them to open things like jellyfin or komga right from the dashboard, and make in-house requests and see their progress, something previously unavailable to them.

at this point of the process i began to realize that this had slowly turned into something a lot bigger than the small hobby i initially planned it to be. i would spend all day at work completing jira tickets just to go home and do the exact same thing for my own work. i began obsessing over making the animations on my dashboard perfect and continuing to optimize load times. on top of this, i had shifted my thinking to "how would my users benefit from this" as opposed to "would my friends like this new feature".

and that's where we land today.

### navi as a part-time job

in some ways, my workflow for navi operates a lot like my full-time job does. in the last few weeks, ive shifted to "sprint cycles" for development. that doesnt necessarily mean that i do retros or standups every day (that would be weird to do a standup with myself), but ive been pushing out developments now on sunday mornings and releasing a changelog to my status page. updates run through shell scripts so my packages, containers, and websites all get updated together.

i also ended up creating a roadmap recently for what the future holds. i have (ambitiously) planned out the rest of this calendar year in detail, and have a vague idea of what is to come in 2027 and 2028.

and i think the biggest piece is how much more i consider my users, or friends, in this process. ive brainstormed sending out a survey to them at the end of each quarter asking for feedback, and recently added a newsletter that would give them the changelog updates after each update gets pushed so they are aware of what's new.

the workload and process ive implemented for navi truly feels at times larger in scale than some weeks at work.

### why i obsess over navi

now dont get me wrong, i dont think of this as some tedious job that i *have* to go home and work on. i actually love working on my server, in fact i spend a lot of my day at work thinking of ways that i can improve my system. im writing the last bits of this blog post while im waiting for a push to go through.

when i decided to go into computer science and software development, the reason behind it all was being able to create cool solutions to everyday problems for loads of people. it started with my family, then to my friends with navi, and who knows, it might be random people all over the place with where this server is potentially headed.

i love developing navi because of the fact that it makes my life and friends' lives easier in one way or another, and that brings me more joy than anything else.

### where navi is headed in the future

as i alluded to a few paragraphs back, i have big plans for where navi is headed, and a large part of that is public-facing. i have already created the brand identities for two products, one of which involves this server and one of which is a completely different website entirely, both of which i am super excited to release once they are ready.

my dream is that the setup i have created over the last year and will continue to tweak will eventually help others to create systems of their own in an easy manner. i can't wait to see where navi, which will have a new name in just a few months, will go next.

![a desk by a window with a monitor, speakers and two desk lamps](/images/navi-school-setup.jpg)

> my setup at school where navi began
