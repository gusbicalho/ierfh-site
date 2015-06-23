<!DOCTYPE html>
<html lang="pt-BR" ng-app="example.App" ng-strict-di ng-controller="AppController as AppCtrl">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <title>Angular + SASS + TypeScript + Browserify + Gulp</title>

  <base href="/ierfh/" />

  <?php wp_head(); ?>
  <link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'stylesheet_url' ); ?>" />
</head>

<body>
  <nav class="navbar navbar-default navbar-fixed-top">
  	<div class="container-fluid">
  		<!-- Brand and toggle get grouped for better mobile display -->
  		<div class="navbar-header">
  			<button class="navbar-toggle" type="button" ng-click="navbarCollapsed = !navbarCollapsed">
  				<span class="sr-only">Toggle navigation</span>
  				<span class="icon-bar"></span>
  				<span class="icon-bar"></span>
  				<span class="icon-bar"></span>
  			</button>
  			<a class="navbar-brand" ui-sref="landing">IERFH</a>
  		</div>
  		<div id="navbar" class="navbar-collapse" ng-init="navbarCollapsed = true" collapse="navbarCollapsed">
        <!-- These will show up in all pages -->
  			<ul class="nav navbar-nav navbar-left">
  				<li><a href>Link</a></li>
  				<li class="dropdown" dropdown>
            <a href class="dropdown-toggle" dropdown-toggle>Dropdown</a>
            <ul class="dropdown-menu">
              <li ng-repeat="i in [1,2,3,4,5]">
                <a href>Option {{::i}}</a>
              </li>
            </ul>
          </li>
  			</ul>
        <!-- These may be overridden by states -->
        <ul class="nav navbar-nav navbar-left" ui-view="navbar-left">
          <li><a href>Link on Left</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right" ui-view="navbar-right">
          <li><a href>Link on Right</a></li>
        </ul>
  		</div><!--/.nav-collapse -->
  	</div><!--/.container -->
  </nav>

  <div ui-view></div>
</body>

</html>
