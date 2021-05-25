
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Node": [
      "Settings",
      "PlexInstance",
      "RadarrInstance",
      "PlexSection",
      "PlexMedia",
      "Genre",
      "Movie",
      "RadarrFile",
      "User"
    ],
    "AbsPlexDevice": [
      "PlexDevice",
      "PlexDeviceServer"
    ]
  }
};
      export default result;
    