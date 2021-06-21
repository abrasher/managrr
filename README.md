 <p align="center">Managrr</p>

## Features

- Manage your media server library
  - Delete all movies under a certain rating
  - Search for all movies that aren't BluRay Remux
  - Remove all shows that are missing episodes in Sonarr
  - Add all Pixar Movies to a Plex Collection
  - ... and much more
- Generate plex thumbnails that show the item's ratings [(examples)]()
  - Customize colours, spacing and icon scaling
- Manage Plex library permissions in a single view

## Preview


## Deployment

Managrr is available as a docker image.

```yaml
managrr:
  container_name: managrr
  image: abrasher/managrr
  ports:
    - 8174:8174
  volumes:
    - /LOCAL_PATH/managrr:/config
```

## License

MIT
