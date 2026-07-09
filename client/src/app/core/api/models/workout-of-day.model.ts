export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  unit: string;
}

export interface WorkoutOfDay {
  isRestDay: boolean;
  completed: boolean;
  workoutName?: string;
  exercises?: WorkoutExercise[];
}
