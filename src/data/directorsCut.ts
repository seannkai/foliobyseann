export interface DirectorsCutFilm {
  id: string;
  title: string;
  year: number | null;
  synopsis: string;
  accolades: string[];
  thumbnailUrl: string;
  embedUrl: string;
  platform: 'youtube' | 'google-drive' | 'video';
}

export const directorsCutFilms: DirectorsCutFilm[] = [
  {
    id: "failure-fear-future",
    title: "failure. fear. future.",
    year: 2022,
    synopsis: "A girl plagued by insecurities undergoes a surreal experience that forces her to reevaluate herself.",
    accolades: ["STI Tagisan ng Sining: Director's Cut 2022"],
    thumbnailUrl: "/directors-cut/fff-thumb.png",
    embedUrl: "/directors-cut/Failure. Fear. Future..mp4",
    platform: "video"
  },
  {
    id: "parallel",
    title: "Parallel",
    year: 2023,
    synopsis: "Who would you be if you were deaf, whose voice is condoned by others, or a beggar, where people's spare change is your only sustenance, or just simply alone together? Do these circumstances define you?",
    accolades: ["STI Tagisan ng Sining: Director's Cut 2023"],
    thumbnailUrl: "/directors-cut/parallel-thumb.png",
    embedUrl: "https://www.youtube-nocookie.com/embed/-lYaotY4kY8",
    platform: "youtube"
  },
  {
    id: "cure-to-your-mental-illness",
    title: "A Cure to Your Mental Illness",
    year: 2024,
    synopsis: "A fake commercial curing \"multiple boyfriends disorder\" so the patient can manage fifteen lovers at once without being called crazy. A media literacy parody built to dogshow classmates.",
    accolades: ["Joint media literacy project"],
    thumbnailUrl: "/directors-cut/cure-thumb.png",
    embedUrl: "https://www.youtube-nocookie.com/embed/Acplfm-_PYg",
    platform: "youtube"
  }
];
