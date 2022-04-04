import { Migration } from '@mikro-orm/migrations';

export class Migration20220215215250 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `tmdbmetadata` (`id` integer not null primary key autoincrement, `adult` integer not null, `backdrop_path` text not null, `budget` integer not null, `homepage` text not null, `imdb_id` text not null, `original_language` text not null, `original_title` text not null, `overview` text not null, `popularity` integer not null, `poster_path` text not null, `release_date` text not null, `revenue` integer not null, `runtime` integer not null, `status` text not null, `tagline` text not null, `title` text not null, `video` integer not null, `vote_average` integer not null, `vote_count` integer not null, `genres` text not null, `production_companies_names` text not null, `production_countries_iso` text not null, `spoken_languages_iso` text not null);');

    this.addSql('create table `omdb_metadata` (`imdb_id` text not null, `rotten_tomatoes_rating` integer not null, `year` integer not null, `metascore` integer not null, `imdb_rating` integer not null, `imdb_votes` integer not null, `rated` text not null, `released` text not null, `runtime` text not null, `director` text not null, `writer` text not null, `actors` text not null, `plot` text not null, `language` text not null, `country` text not null, `awards` text not null, `poster` text not null, `type` text not null, `dvd` text not null, `box_office` text not null, `production` text not null, `website` text not null, primary key (`imdb_id`));');

    this.addSql('create table `radarr_instance` (`id` text not null, `url` text not null, `api_key` text not null, `instance_name` text not null, primary key (`id`));');
    this.addSql('create unique index `radarr_instance_url_unique` on `radarr_instance` (`url`);');

    this.addSql('create table `plex_instance` (`id` text not null, `machine_identifier` text not null, `friendly_name` text not null, `url` text not null, `token` text not null, primary key (`id`));');
    this.addSql('create unique index `plex_instance_machine_identifier_unique` on `plex_instance` (`machine_identifier`);');

    this.addSql('create table `poster_generation_settings` (`id` json not null, `source_opacity` integer not null, `destination_opacity` integer not null, `blend_mode` json not null, `spacing` integer not null, `global_icon_scale` integer not null, `rating_scale` integer not null, `font_colour` text not null, `image_height` integer not null, `image_width` integer not null, `jpeg_quality` integer not null, `box_colour` text not null, primary key (`id`));');

    this.addSql('create table `settings` (`id` text not null, `language` text not null, `password` text null, `port` integer not null, `api_key` json not null, `plex_account_token` text null, `omdb_key` text null, `tmdb_key` text null, `poster_settings_id` json not null, constraint `settings_poster_settings_id_foreign` foreign key(`poster_settings_id`) references `poster_generation_settings`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `settings_poster_settings_id_index` on `settings` (`poster_settings_id`);');
    this.addSql('create unique index `settings_poster_settings_id_unique` on `settings` (`poster_settings_id`);');

    this.addSql('create table `media` (`id` text not null, `title` text not null, `year` integer not null, `imdb_id` text not null, `type` text not null, `omdb_metadata` json not null, `tmdb_metadata_id` integer not null, constraint `media_tmdb_metadata_id_foreign` foreign key(`tmdb_metadata_id`) references `tmdbmetadata`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create unique index `media_imdb_id_unique` on `media` (`imdb_id`);');
    this.addSql('create index `media_tmdb_metadata_id_index` on `media` (`tmdb_metadata_id`);');
    this.addSql('create unique index `media_tmdb_metadata_id_unique` on `media` (`tmdb_metadata_id`);');

    this.addSql('create table `plex_metadata` (`id` json not null, `library_section_title` text not null, `library_section_key` text not null, `library_section_uuid` text not null, `type` text not null, `title` text not null, `originally_available_at` text not null, `thumb` text not null, `rating_key` text not null, `library_section_id` integer not null, `added_at` date not null, `updated_at` date not null, `created_at` date not null, `plex_instance_id` text not null, `media_id` text not null, constraint `plex_metadata_plex_instance_id_foreign` foreign key(`plex_instance_id`) references `plex_instance`(`id`) on update cascade, constraint `plex_metadata_media_id_foreign` foreign key(`media_id`) references `media`(`id`) on update cascade, primary key (`id`));');
    this.addSql('create index `plex_metadata_plex_instance_id_index` on `plex_metadata` (`plex_instance_id`);');
    this.addSql('create index `plex_metadata_media_id_index` on `plex_metadata` (`media_id`);');

    this.addSql('create table `radarr_metadata` (`_id` json not null, `id` integer not null, `title` text not null, `original_title` text not null, `secondary_year_source_id` integer not null, `sort_title` text not null, `size_on_disk` integer not null, `status` text not null, `overview` text not null, `in_cinemas` text not null, `physical_release` text not null, `digital_release` text not null, `website` text not null, `year` integer not null, `has_file` integer not null, `you_tube_trailer_id` text not null, `studio` text not null, `path` text not null, `quality_profile_id` integer not null, `monitored` integer not null, `minimum_availability` text not null, `is_available` integer not null, `folder_name` text not null, `runtime` integer not null, `clean_title` text not null, `imdb_id` text not null, `tmdb_id` integer not null, `title_slug` text not null, `certification` text not null, `tags` text not null, `added` text not null, `alternate_titles` text null, `relative_path` text not null, `size` integer not null, `date_added` text not null, `indexer_flags` integer not null, `quality` text not null, `quality_cutoff_not_met` integer not null, `release_group` text null, `edition` text not null, `instance_id` text not null, `media_id` text not null, constraint `radarr_metadata_instance_id_foreign` foreign key(`instance_id`) references `radarr_instance`(`id`) on update cascade, constraint `radarr_metadata_media_id_foreign` foreign key(`media_id`) references `media`(`id`) on update cascade, primary key (`_id`));');
    this.addSql('create index `radarr_metadata_instance_id_index` on `radarr_metadata` (`instance_id`);');
    this.addSql('create index `radarr_metadata_media_id_index` on `radarr_metadata` (`media_id`);');
  }

}
