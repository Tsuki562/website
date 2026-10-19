<?php
/**
 * Plugin Name: CSHK Content Catalog
 * Description: Structured products and public resource records for the Nuxt website.
 * Version: 0.1.0
 * Requires at least: 6.5
 * Requires PHP: 8.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function cshk_catalog_register_post_types(): void
{
    register_post_type('cshk_product', [
        'labels' => [
            'name' => '产品',
            'singular_name' => '产品',
            'add_new_item' => '添加产品',
            'edit_item' => '编辑产品',
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'rest_base' => 'cshk-product',
        'has_archive' => false,
        'rewrite' => false,
        'menu_icon' => 'dashicons-products',
        'supports' => ['title', 'editor', 'thumbnail', 'page-attributes', 'custom-fields'],
    ]);

    register_post_type('cshk_download', [
        'labels' => [
            'name' => '公开资料',
            'singular_name' => '公开资料',
            'add_new_item' => '添加公开资料',
            'edit_item' => '编辑公开资料',
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'rest_base' => 'cshk-download',
        'has_archive' => false,
        'rewrite' => false,
        'menu_icon' => 'dashicons-download',
        'supports' => ['title', 'editor', 'page-attributes', 'custom-fields'],
    ]);
}
add_action('init', 'cshk_catalog_register_post_types');

function cshk_catalog_product_schema(): array
{
    $localized = [
        'type' => 'object',
        'properties' => [
            'zh' => ['type' => 'string'],
            'en' => ['type' => 'string'],
        ],
        'additionalProperties' => false,
    ];

    return [
        'type' => 'object',
        'properties' => [
            'category' => ['type' => 'string'],
            'eyebrow' => $localized,
            'description' => $localized,
            'href' => ['type' => 'string'],
            'highlights' => [
                'type' => 'array',
                'items' => $localized,
            ],
        ],
        'additionalProperties' => false,
    ];
}

function cshk_catalog_download_schema(): array
{
    $localized = [
        'type' => 'object',
        'properties' => [
            'zh' => ['type' => 'string'],
            'en' => ['type' => 'string'],
        ],
        'additionalProperties' => false,
    ];

    return [
        'type' => 'object',
        'properties' => [
            'product_id' => ['type' => 'string'],
            'target' => ['type' => 'string'],
            'kind' => ['type' => 'string'],
            'channel' => ['type' => 'string'],
            'hardware_version' => ['type' => 'string'],
            'version' => ['type' => 'string'],
            'release_date' => ['type' => 'string'],
            'file_name' => ['type' => 'string'],
            'file_size' => ['type' => 'string'],
            'sha256' => ['type' => 'string'],
            'download_count' => ['type' => 'integer'],
            'changelog' => $localized,
            'build_options' => [
                'type' => 'array',
                'items' => ['type' => 'string'],
            ],
            'file_media_id' => ['type' => 'integer'],
        ],
        'additionalProperties' => false,
    ];
}

function cshk_catalog_register_meta(): void
{
    foreach (['cshk_product' => cshk_catalog_product_schema(), 'cshk_download' => cshk_catalog_download_schema()] as $post_type => $schema) {
        register_post_meta($post_type, 'cshk_data', [
            'single' => true,
            'type' => 'object',
            'show_in_rest' => ['schema' => $schema],
            'auth_callback' => static fn (): bool => current_user_can('edit_posts'),
            'sanitize_callback' => 'cshk_catalog_sanitize_meta',
        ]);
    }
}
add_action('init', 'cshk_catalog_register_meta');

function cshk_catalog_sanitize_meta($value)
{
    if (!is_array($value)) {
        return [];
    }

    $clean = [];
    foreach ($value as $key => $item) {
        $safe_key = sanitize_key((string) $key);
        if (is_array($item)) {
            $clean[$safe_key] = cshk_catalog_sanitize_meta($item);
        } elseif (is_int($item) || is_float($item) || is_bool($item)) {
            $clean[$safe_key] = $item;
        } else {
            $clean[$safe_key] = sanitize_text_field((string) $item);
        }
    }
    return $clean;
}

function cshk_catalog_add_meta_boxes(): void
{
    add_meta_box('cshk-product-data', 'Nuxt 产品字段（JSON）', 'cshk_catalog_render_meta_box', 'cshk_product', 'normal', 'high');
    add_meta_box('cshk-download-data', 'Nuxt 资料字段（JSON）', 'cshk_catalog_render_meta_box', 'cshk_download', 'normal', 'high');
}
add_action('add_meta_boxes', 'cshk_catalog_add_meta_boxes');

function cshk_catalog_render_meta_box(WP_Post $post): void
{
    wp_nonce_field('cshk_catalog_save_data', 'cshk_catalog_nonce');
    $data = get_post_meta($post->ID, 'cshk_data', true);
    $json = wp_json_encode(is_array($data) ? $data : new stdClass(), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    ?>
    <p>按 JSON 编辑结构化字段。产品图片使用右侧“特色图像”；资料文件先上传到媒体库，再填写其附件 ID 到 <code>file_media_id</code>。只有已发布的记录会进入公开 API。</p>
    <textarea name="cshk_catalog_data" rows="18" style="width:100%;font-family:monospace" spellcheck="false"><?php echo esc_textarea($json ?: '{}'); ?></textarea>
    <?php
}

function cshk_catalog_save_meta_box(int $post_id): void
{
    if (!isset($_POST['cshk_catalog_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['cshk_catalog_nonce'])), 'cshk_catalog_save_data')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    $post_type = get_post_type($post_id);
    if (!in_array($post_type, ['cshk_product', 'cshk_download'], true) || !current_user_can('edit_post', $post_id)) {
        return;
    }
    if (!isset($_POST['cshk_catalog_data']) || !is_string($_POST['cshk_catalog_data'])) {
        return;
    }

    $decoded = json_decode(wp_unslash($_POST['cshk_catalog_data']), true);
    if (is_array($decoded)) {
        update_post_meta($post_id, 'cshk_data', $decoded);
    }
}
add_action('save_post', 'cshk_catalog_save_meta_box');

function cshk_catalog_localized_value($value): array
{
    return [
        'zh' => is_array($value) && isset($value['zh']) ? (string) $value['zh'] : '',
        'en' => is_array($value) && isset($value['en']) ? (string) $value['en'] : '',
    ];
}

function cshk_catalog_product_record(WP_Post $post): array
{
    $data = get_post_meta($post->ID, 'cshk_data', true);
    $data = is_array($data) ? $data : [];
    $highlights = isset($data['highlights']) && is_array($data['highlights']) ? $data['highlights'] : [];

    return [
        'id' => $post->post_name,
        'category' => (string) ($data['category'] ?? 'flight-controller'),
        'name' => get_the_title($post),
        'eyebrow' => cshk_catalog_localized_value($data['eyebrow'] ?? null),
        'description' => cshk_catalog_localized_value($data['description'] ?? null),
        'href' => (string) ($data['href'] ?? '/products/'),
        'image' => get_the_post_thumbnail_url($post, 'full') ?: null,
        'highlights' => array_values(array_map('cshk_catalog_localized_value', $highlights)),
    ];
}

function cshk_catalog_download_record(WP_Post $post): array
{
    $data = get_post_meta($post->ID, 'cshk_data', true);
    $data = is_array($data) ? $data : [];
    $media_id = absint($data['file_media_id'] ?? 0);
    $file_path = $media_id ? get_attached_file($media_id) : false;
    $file_size = (string) ($data['file_size'] ?? '');
    if ($file_size === '' && $file_path && file_exists($file_path)) {
        $file_size = size_format((int) filesize($file_path));
    }
    $product_id = (string) ($data['product_id'] ?? '');
    $product = $product_id ? get_page_by_path($product_id, OBJECT, 'cshk_product') : null;

    return [
        'id' => $post->post_name,
        'productId' => $product_id,
        'productName' => $product ? get_the_title($product) : '',
        'target' => (string) ($data['target'] ?? ''),
        'kind' => (string) ($data['kind'] ?? 'manual'),
        'channel' => (string) ($data['channel'] ?? 'document'),
        'hardwareVersion' => (string) ($data['hardware_version'] ?? ''),
        'version' => (string) ($data['version'] ?? ''),
        'releaseDate' => (string) ($data['release_date'] ?? get_the_date('Y-m-d', $post)),
        'fileName' => (string) ($data['file_name'] ?? get_the_title($post)),
        'fileSize' => $file_size,
        'sha256' => (string) ($data['sha256'] ?? ''),
        'downloadCount' => absint($data['download_count'] ?? 0),
        'changelog' => cshk_catalog_localized_value($data['changelog'] ?? null),
        'buildOptions' => isset($data['build_options']) && is_array($data['build_options']) ? array_values($data['build_options']) : [],
        'href' => $media_id ? wp_get_attachment_url($media_id) : null,
        'downloadHref' => $media_id ? (wp_get_original_image_url($media_id) ?: wp_get_attachment_url($media_id)) : null,
    ];
}

function cshk_catalog_register_routes(): void
{
    register_rest_route('cshk/v1', '/products', [
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => static function (): WP_REST_Response {
            $posts = get_posts([
                'post_type' => 'cshk_product',
                'post_status' => 'publish',
                'numberposts' => 100,
                'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
            ]);
            return rest_ensure_response(array_map('cshk_catalog_product_record', $posts));
        },
    ]);

    register_rest_route('cshk/v1', '/downloads', [
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => static function (): WP_REST_Response {
            $posts = get_posts([
                'post_type' => 'cshk_download',
                'post_status' => 'publish',
                'numberposts' => 100,
                'orderby' => ['menu_order' => 'ASC', 'date' => 'DESC'],
            ]);
            return rest_ensure_response(array_map('cshk_catalog_download_record', $posts));
        },
    ]);
}
add_action('rest_api_init', 'cshk_catalog_register_routes');
