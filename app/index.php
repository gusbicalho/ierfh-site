<!DOCTYPE html>
<html lang="pt-BR" ng-app="example.App" ng-strict-di ng-controller="AppController as AppCtrl">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <title>IERFH - Instituto Ética, Racionalidade e Futuro da Humanidade</title>

  <base href="/ierfh/" />

  <?php wp_head(); ?>
  <link rel="stylesheet" type="text/css" media="all" href="<?php bloginfo( 'stylesheet_url' ); ?>" />
</head>

<body ng-class="{'navbar-showing': !AppCtrl.isHome()}">
  <nav class="navbar navbar-default navbar-fixed-top" ng-class="{'navbar-showing': !AppCtrl.isHome()}">
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
          <li ng-repeat="category in AppCtrl.topCategories" dropdown>
            <a ui-sref="category({catSlug: category.slug})">
              {{::category.name}}
              <span ng-if="AppCtrl.categoryChildren[category.ID]"
                  class="dropdown-toggle" dropdown-toggle>
                <span class="caret"></span>
              </span>
            </a>
            <ul ng-if="AppCtrl.categoryChildren[category.ID]"
                class="dropdown-menu">
              <li ng-repeat="category in AppCtrl.categoryChildren[category.ID]">
                <a ui-sref="category({catSlug: category.slug})">{{::category.name}}</a>
              </li>
            </ul>
          </li>
  			</ul>
        <ul class="nav navbar-nav navbar-right">
  				<li><a href="wp-json">JSON API</a></li>
  				<li><a href="wp-admin">Admin</a></li>
        </ul>
        <!-- These may be overridden by states -->
        <ul class="nav navbar-nav navbar-left" ui-view="navbar-left">
        </ul>
        <ul class="nav navbar-nav navbar-right" ui-view="navbar-right">
        </ul>
  		</div><!--/.nav-collapse -->
  	</div><!--/.container -->
  </nav>
  <div class="top-view-wrapper">
    <div ui-view></div>
  </div>
</body>

</html>
