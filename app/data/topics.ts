export type ResearchItem = {
    id: string;
    title: string;
    url?: string;
    summary?: string;
    takeaways?: string[];
  };
  
  export type Intervention = {
    id: string;
    name: string;
    what_it_is: string;
    why_it_helps_basic: string;
    steps: string[];
    time_cost_minutes?: number;
    cost?: string;
    source_ids?: string[];
  };
  
  export type TopicStatus = "live" | "coming_soon";
  
  export type Topic = {
    slug: string;
    title: string;
    description_basic: string;
    status: TopicStatus;
    research: ResearchItem[];
    interventions: Intervention[];
  };
  
  export const TOPICS: Topic[] = [
    {
      slug: "sleep",
      title: "Sleep",
      description_basic:
        "Sleep influences mood, focus, and stress. Small routine changes can support better sleep over time.",
      status: "live",
      research: [
        {
          id: "sleep-001",
          title:
            "The Extraordinary Importance of Sleep: The Detrimental Effects of Inadequate Sleep on Health and Public Safety",
          url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6281147/",
          summary:
            "Overview article summarizing how inadequate sleep affects health, cognition, mood, and safety.",
        },
      ],
      interventions: [
        {
          id: "sleep-int-001",
          name: "2-minute wind-down",
          what_it_is: "A tiny pre-sleep routine to reduce mental load and cue bedtime.",
          why_it_helps_basic:
            "Consistent wind-down routines can lower arousal and make it easier to transition into sleep.",
          steps: [
            "Dim lights and put phone on Do Not Disturb.",
            "Write 1 worry + 1 next step on paper.",
            "Set one bedtime reminder for tomorrow.",
          ],
          time_cost_minutes: 2,
          cost: "free",
          source_ids: ["sleep-001"],
        },
      ],
    },
  
    {
      slug: "anxiety",
      title: "Anxiety",
      description_basic:
        "Anxiety can show up in thoughts, body sensations, and behavior. Small tools can help you feel more grounded.",
      status: "coming_soon",
      research: [],
      interventions: [],
    },
  
    {
      slug: "depression",
      title: "Depression",
      description_basic:
        "Depression can affect energy, sleep, and motivation. Support strategies can help you regain stability over time.",
      status: "coming_soon",
      research: [],
      interventions: [],
    },
  
    {
      slug: "mood",
      title: "Mood",
      description_basic:
        "Mood fluctuates with stress, sleep, routines, and connection. Small habits can improve baseline mood over time.",
      status: "coming_soon",
      research: [],
      interventions: [],
    },
  ];
  
  export function getTopic(slug: string): Topic | undefined {
    return TOPICS.find((t) => t.slug === slug);
  }