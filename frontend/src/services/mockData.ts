/** Mock-данные для работы каркаса без Supabase (на базе прогона 187122). */
import type { Project, Skill, Task, Team, TeamAvailability, ScheduleRun } from '../domain/types'

export const mockTeams: Team[] = [
  { id: 'javier', name: 'Javier Cruz-Lopez', home_address: '7402 Wellesley Dr, College Park, MD 20740', lat: 38.99, lng: -76.93, slack_user_id: null, skills: ['Fine Carpentry & Trim', 'Hardware Installation'] },
  { id: 'oscar', name: 'Oscar Herrera', home_address: '5522 Center Ave, Lanham, MD 20706', lat: 38.96, lng: -76.86, slack_user_id: null, skills: ['Hardware Installation'] },
  { id: 'gheorghe', name: 'Gheorghe Caminschi', home_address: '18271 Rolling Meadow Way, Olney, MD 20832', lat: 39.15, lng: -77.07, slack_user_id: 'U0988MNV954', skills: [] },
  { id: 'ezequiel', name: 'Ezequiel Perez Garcia - ACH Group LLC', home_address: '404 Girard St, Gaithersburg, MD 20877', lat: 39.14, lng: -77.2, slack_user_id: null, skills: ['Cabinet Installation'] },
]

export const mockProjects: Project[] = [
  { id: 'p1', name: '25-04-30 Knight-Washington, DC', address: '56 Florida Avenue Northwest, Washington, DC, 20001', lat: 38.91, lng: -77.01, project_manager: 'Wilfredo Lopez' },
  { id: 'p2', name: '25-06-05 Woodhull-Davidsonville, MD', address: '2903 Spring Lakes Dr, Davidsonville, MD, 21035', lat: 38.93, lng: -76.63, project_manager: 'Gheorghe Caminschi' },
  { id: 'p3', name: '25-09-16 Pitts-Edgewater, MD', address: '4007 Dark Horse Way, Edgewater, MD, 21037', lat: 38.95, lng: -76.55, project_manager: 'Gheorghe Caminschi' },
]

export const mockSkills: Skill[] = [
  { id: 's1', name: 'Cabinet Installation', category: 'Finish and Fine Carpentry', description: 'Basement bars, vanities, and built-ins.', available_team_ids: ['ezequiel'] },
  { id: 's2', name: 'Fine Carpentry & Trim', category: 'Finish and Fine Carpentry', description: 'Moldings, shelving, detailed woodwork.', available_team_ids: ['javier'] },
  { id: 's3', name: 'Hardware Installation', category: 'Finish and Fine Carpentry', description: 'Cabinet pulls, hinges, handles.', available_team_ids: ['javier', 'oscar'] },
]

export const mockTasks: Task[] = [
  {
    id: 't1', status: 'requested', task_type: 'Project task', project_id: 'p2', project_name: mockProjects[1].name,
    description: 'Install Wet Bar hardware (handles etc)', scheduled_date: '2025-10-29',
    time_type: null, exact_time: null, timeframe_start: null, timeframe_end: null,
    estimated_duration_min: 90, task_address: mockProjects[1].address, lat: 38.93, lng: -76.63,
    project_manager: 'Gheorghe Caminschi', assigned_team_id: 'javier', priority: 5,
    required_skill_ids: ['s3'], schedule_prompt: null, additional_stop: null,
  },
  {
    id: 't2', status: 'requested', task_type: 'Project task', project_id: 'p1', project_name: mockProjects[0].name,
    description: 'Build & Install Simple Closet Framing (5x3 ft)', scheduled_date: '2025-10-29',
    time_type: 'exact', exact_time: '12:00', timeframe_start: null, timeframe_end: null,
    estimated_duration_min: 240, task_address: mockProjects[0].address, lat: 38.91, lng: -77.01,
    project_manager: 'Wilfredo Lopez', assigned_team_id: 'javier', priority: 5,
    required_skill_ids: ['s2'], schedule_prompt: null,
    additional_stop: { when: 'after', address: 'Home Depot, 3301 East-West Hwy, Hyattsville, MD', lat: 38.96, lng: -76.95, duration_min: 30 },
  },
  {
    id: 't3', status: 'requested', task_type: 'Project task', project_id: 'p3', project_name: mockProjects[2].name,
    description: 'Install Drop Ceiling Grid (200 sq ft)', scheduled_date: '2025-10-29',
    time_type: null, exact_time: null, timeframe_start: null, timeframe_end: null,
    estimated_duration_min: 150, task_address: mockProjects[2].address, lat: 38.95, lng: -76.55,
    project_manager: 'Gheorghe Caminschi', assigned_team_id: 'javier', priority: 5,
    required_skill_ids: [], schedule_prompt: null, additional_stop: null,
  },
]

export const mockAvailability: TeamAvailability[] = [
  { id: 'a1', team_id: 'ezequiel', team_name: 'Alfredo Lopez', start_date: '2025-09-20', end_date: '2025-09-27' },
]

/** output_data из прогона 187122 (бригада Javier — с якорем 12:00). */
export const mockScheduleRun: ScheduleRun = {
  request_id: 'SMyNKAosmVEsjo9-10mzB',
  status: 'done',
  comments_ai_1: {},
  comments_ai_2: { travel_time_methodology: 'Realistic route-based estimates for DC/MD/VA.' },
  output_data: {
    schedule: [
      {
        team_id: 'javier', team_name: 'Javier Cruz-Lopez', date: '2025-10-29', timezone: 'America/New_York',
        team_home_base: '7402 Wellesley Dr, College Park, MD 20740',
        workday_start_time: '09:00', workday_end_time: '19:25',
        morning_commute_minutes: 40, end_of_day_commute_minutes: 45,
        total_working_minutes: 590, day_length_category: 'overtime_8_to_10', overtime: true,
        tasks: [
          { scheduled_order: 1, task_id: 't1', project_id: 'p2', project_name: mockProjects[1].name, project_address: mockProjects[1].address, description: 'Install Wet Bar hardware (handles etc)', anchor: false, anchor_time: '', start_time: '09:00', end_time: '10:30', duration_minutes: 90, drive_minutes_from_previous: 0 },
          { scheduled_order: 2, task_id: 't2', project_id: 'p1', project_name: mockProjects[0].name, project_address: mockProjects[0].address, description: 'Build & Install Simple Closet Framing (5x3 ft)', anchor: true, anchor_time: '12:00', start_time: '12:00', end_time: '16:00', duration_minutes: 240, drive_minutes_from_previous: 55, additional_stop: { when: 'after', address: 'Home Depot, Hyattsville, MD', lat: 38.96, lng: -76.95, duration_min: 30, travel_to_min: 23, travel_from_min: 51 } },
          { scheduled_order: 3, task_id: 't3', project_id: 'p3', project_name: mockProjects[2].name, project_address: mockProjects[2].address, description: 'Install Drop Ceiling Grid (200 sq ft)', anchor: false, anchor_time: '', start_time: '16:55', end_time: '19:25', duration_minutes: 150, drive_minutes_from_previous: 55 },
        ],
        summary: { total_tasks: 3, total_travel_in_day_minutes: 110, compliance: { no_overlaps: true, anchors_preserved: true, all_tasks_scheduled: true } },
      },
    ],
  },
}
