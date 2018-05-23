<html lang="en">

<head>
    <!-- Calls title from other pages. Also big brane mode-->
    <title>{$title} - Verge</title>
    <!-- verge.css, probably the most important css file for Kaori-->
    <link rel="stylesheet" href="assets/verge.css">
</head>

<body>
    <div class="container">
        <div class="navbar">
            <div class="link">
                <ul>
                    <li {!selected?home:class(active)}>Home</li>
                    <li {!selected?leaderboards:class(active)}>Leaderboards</li>
                    <li {!selected?info:class(active)}>Info</li>
                </ul>
            </div>
            <div class="search">
                <input type="text" placeholder="Looking for someone?">
            </div>
            <div class="user">
                <span class="button">Log in</span>
                <span class="button">Sign up</span>
            </div>
        </div>
        <div class="content">
            {$content}
        </div>
    </div>
</body>

<script src="assets/main.js"></script>
<script>
        //
</script>

</html>