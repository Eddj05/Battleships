<?php
/* Header */
$page_title = 'Webprogramming Assignment 3';
$navigation = Array(
    'active' => 'News',
    'items' => Array(
        'News' => '/WP24/assignment_3/index.php',
        'Add news item' => '/WP24/assignment_3/news_add.php',
        'Leap Year' => '/WP24/assignment_3/leapyear.php',
        'Simple Form' => '/WP24/assignment_3/simple_form.php'
    )
);
include __DIR__ . '/tpl//head.php';
include __DIR__ . '/tpl/body_start.php';

// read json file
$json_file = __DIR__ . '/data/articles.json';
$json_data = file_get_contents($json_file);
$articles = json_decode($json_data, true);
?>

    <script type="application/javascript" src="scripts/main.js"></script>

    <div class="pd-40"></div>
    <div class="row">
        <div class="col-md-12" id="news_container">
            <h1>News:</h1>
            <?php if ($articles): ?>
                <?php foreach ($articles as $article): ?>
                    <div class="news-item">
                        <h4><?php echo htmlspecialchars($article['title'], ENT_QUOTES, 'UTF-8'); ?></h4>
                        <p><?php echo htmlspecialchars($article['article'], ENT_QUOTES, 'UTF-8'); ?></p>
                        <small>Last edited: <?php echo date('Y-m-d H:i:s', $article['date']); ?></small>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No news items found.</p>
            <?php endif; ?>
        </div>
    </div>
<?php
include __DIR__ . '/tpl/body_end.php';
?><?php
