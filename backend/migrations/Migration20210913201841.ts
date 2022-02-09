import { Migration } from '@mikro-orm/migrations';

export class Migration20210913201841 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `tmdbmetadata` (`id` integer not null primary key autoincrement, `adult` integer not null, `backdrop_path` varchar not null, `budget` integer not null, `homepage` varchar not null, `imdb_id` varchar not null, `original_language` varchar not null, `original_title` varchar not null, `overview` varchar not null, `popularity` integer not null, `poster_path` varchar not null, `release_date` varchar not null, `revenue` integer not null, `runtime` integer not null, `status` varchar not null, `tagline` varchar not null, `title` varchar not null, `video` integer not null, `vote_average` integer not null, `vote_count` integer not null, `genres` text not null, `production_companies_names` text not null, `production_countries_iso` text not null, `spoken_languages_iso` text not null);');

    this.addSql('create table `omdb_metadata` (`imdb_id` varchar not null, `rotten_tomatoes_rating` integer not null, `year` integer not null, `metascore` integer not null, `imdb_rating` integer not null, `imdb_votes` integer not null, `rated` varchar not null, `released` varchar not null, `runtime` varchar not null, `director` varchar not null, `writer` varchar not null, `actors` varchar not null, `plot` varchar not null, `language` varchar not null, `country` varchar not null, `awards` varchar not null, `poster` varchar not null, `type` varchar not null, `dvd` varchar not null, `box_office` varchar not null, `production` varchar not null, `website` varchar not null, primary key (`imdb_id`));');

    this.addSql('create table `radarr_instance` (`id` varchar not null, `url` varchar not null, `api_key` varchar not null, `instance_name` varchar not null, primary key (`id`));');
    this.addSql('create unique index `radarr_instance_url_unique` on `radarr_instance` (`url`);');

    this.addSql('create table `plex_instance` (`id` varchar not null, `machine_identifier` varchar not null, `friendly_name` varchar not null, `url` varchar not null, `token` varchar not null, primary key (`id`));');
    this.addSql('create unique index `plex_instance_machine_identifier_unique` on `plex_instance` (`machine_identifier`);');

    this.addSql('create table `poster_generation_settings` (`id` text not null, `source_opacity` integer not null, `destination_opacity` integer not null, `blend_mode` text not null, `spacing` integer not null, `global_icon_scale` integer not null, `rating_scale` integer not null, `font_colour` varchar not null, `image_height` integer not null, `image_width` integer not null, `jpeg_quality` integer not null, `box_colour` varchar not null, primary key (`id`));');

    this.addSql('create table `settings` (`id` varchar not null, `language` varchar not null, `password` varchar null, `port` integer not null, `api_key` text not null, `plex_account_token` varchar null, `omdb_key` varchar null, `tmdb_key` varchar null, primary key (`id`));');

    this.addSql('create table `media` (`id` varchar not null, `title` varchar not null, `year` integer not null, `imdb_id` varchar not null, `type` varchar not null, `omdb_metadata` json not null, primary key (`id`));');
    this.addSql('create unique index `media_imdb_id_unique` on `media` (`imdb_id`);');

    this.addSql('create table `plex_metadata` (`id` text not null, `library_section_title` varchar not null, `library_section_key` varchar not null, `library_section_uuid` varchar not null, `type` varchar not null, `title` varchar not null, `originally_available_at` varchar not null, `thumb` varchar not null, `rating_key` varchar not null, `library_section_id` integer not null, `added_at` date not null, `updated_at` date not null, `created_at` date not null, primary key (`id`));');

    this.addSql('create table `radarr_metadata` (`_id` text not null, `id` integer not null, `title` varchar not null, `original_title` varchar not null, `secondary_year_source_id` integer not null, `sort_title` varchar not null, `size_on_disk` integer not null, `status` varchar not null, `overview` varchar not null, `in_cinemas` varchar not null, `physical_release` varchar not null, `digital_release` varchar not null, `website` varchar not null, `year` integer not null, `has_file` integer not null, `you_tube_trailer_id` varchar not null, `studio` varchar not null, `path` varchar not null, `quality_profile_id` integer not null, `monitored` integer not null, `minimum_availability` varchar not null, `is_available` integer not null, `folder_name` varchar not null, `runtime` integer not null, `clean_title` varchar not null, `imdb_id` varchar not null, `tmdb_id` integer not null, `title_slug` varchar not null, `certification` varchar not null, `tags` text not null, `added` varchar not null, `alternate_titles` text null, `relative_path` varchar not null, `size` integer not null, `date_added` varchar not null, `indexer_flags` integer not null, `quality` varchar not null, `quality_cutoff_not_met` integer not null, `release_group` varchar null, `edition` varchar not null, primary key (`_id`));');

    this.addSql('alter table `settings` add column `poster_settings_id` text null;');
    this.addSql('create index `settings_poster_settings_id_index` on `settings` (`poster_settings_id`);');
    this.addSql('create unique index `settings_poster_settings_id_unique` on `settings` (`poster_settings_id`);');

    this.addSql('alter table `media` add column `tmdb_metadata_id` integer null;');
    this.addSql('create index `media_tmdb_metadata_id_index` on `media` (`tmdb_metadata_id`);');
    this.addSql('create unique index `media_tmdb_metadata_id_unique` on `media` (`tmdb_metadata_id`);');

    this.addSql('alter table `plex_metadata` add column `plex_instance_id` varchar null;');
    this.addSql('alter table `plex_metadata` add column `media_id` varchar null;');
    this.addSql('create index `plex_metadata_plex_instance_id_index` on `plex_metadata` (`plex_instance_id`);');
    this.addSql('create index `plex_metadata_media_id_index` on `plex_metadata` (`media_id`);');

    this.addSql('alter table `radarr_metadata` add column `instance_id` varchar null;');
    this.addSql('alter table `radarr_metadata` add column `media_id` varchar null;');
    this.addSql('create index `radarr_metadata_instance_id_index` on `radarr_metadata` (`instance_id`);');
    this.addSql('create index `radarr_metadata_media_id_index` on `radarr_metadata` (`media_id`);');
  }

}
