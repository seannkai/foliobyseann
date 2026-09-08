export interface DirectorsCutFilm {
  id: string;
  title: string;
  year: number | null;
  synopsis: string;
  accolades: string[];
  thumbnailUrl: string;
  embedUrl: string;
  platform: 'youtube' | 'google-drive';
}

export const directorsCutFilms: DirectorsCutFilm[] = [
  {
    id: "failure-fear-future",
    title: "failure. fear. future.",
    year: 2021,
    synopsis: "A girl plagued by insecurities undergoes a surreal experience that forces her to reevaluate herself.",
    accolades: ["STI Tagisan ng Sining: Director's Cut 2021"],
    thumbnailUrl: "/directors-cut/fff-thumb.jpg",
    embedUrl: "https://drive.google.com/file/d/1XIcJkrElgejrL5J1obmN3g81Imm6F1ar/preview",
    platform: "google-drive"
  },
  {
    id: "parallel",
    title: "Parallel",
    year: 2022,
    synopsis: "Who would you be if you were deaf, whose voice is condoned by others, or a beggar, where people's spare change is your only sustenance, or just simply alone together? Do these circumstances define you?",
    accolades: ["STI Tagisan ng Sining: Director's Cut 2022"],
    thumbnailUrl: "/directors-cut/parallel-thumb.jpg",
    embedUrl: "https://www.youtube.com/embed/-lYaotY4kY8",
    platform: "youtube"
  },
  {
    id: "cure-to-your-mental-illness",
    title: "A Cure to Your Mental Illness",
    year: null,
    synopsis: "A fake commercial curing \"multiple boyfriends disorder\" so the patient can manage fifteen lovers at once without being called crazy. A media literacy parody built to dogshow classmates.",
    accolades: ["Joint media literacy project"],
    thumbnailUrl: "/directors-cut/cure-thumb.jpg",
    embedUrl: "https://www.youtube.com/embed/Acplfm-_PYg",
    platform: "youtube"
  }
];
