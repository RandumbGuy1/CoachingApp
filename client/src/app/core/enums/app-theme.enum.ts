export enum AppTheme {
  Light = "Light",
  Dark = "Dark",
}

export const themeOptions: { label: string, value: AppTheme }[] = [
  { label: 'Light', value: AppTheme.Light },
  { label: 'Dark', value: AppTheme.Dark }
];