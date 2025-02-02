<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitb59578d06fb8370da6a37827ae165a06
{
    public static $prefixLengthsPsr4 = array (
        'C' => 
        array (
            'CommentConverter\\Plugin\\' => 24,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'CommentConverter\\Plugin\\' => 
        array (
            0 => __DIR__ . '/../..' . '/includes',
        ),
    );

    public static $classMap = array (
        'CommentConverter\\Plugin\\Bootstrap\\Admin\\ClassicEditor' => __DIR__ . '/../..' . '/includes/Bootstrap/Admin/ClassicEditor.php',
        'CommentConverter\\Plugin\\Bootstrap\\Admin\\ListTables' => __DIR__ . '/../..' . '/includes/Bootstrap/Admin/ListTables.php',
        'CommentConverter\\Plugin\\Bootstrap\\Admin\\Onboarding' => __DIR__ . '/../..' . '/includes/Bootstrap/Admin/Onboarding.php',
        'CommentConverter\\Plugin\\Bootstrap\\Admin\\Pages' => __DIR__ . '/../..' . '/includes/Bootstrap/Admin/Pages.php',
        'CommentConverter\\Plugin\\Bootstrap\\Async\\CommentNotification' => __DIR__ . '/../..' . '/includes/Bootstrap/Async/CommentNotification.php',
        'CommentConverter\\Plugin\\Bootstrap\\Async\\NotificationDigest' => __DIR__ . '/../..' . '/includes/Bootstrap/Async/NotificationDigest.php',
        'CommentConverter\\Plugin\\Bootstrap\\Backend\\CommentHandler' => __DIR__ . '/../..' . '/includes/Bootstrap/Backend/CommentHandler.php',
        'CommentConverter\\Plugin\\Bootstrap\\Backend\\RewriteRules' => __DIR__ . '/../..' . '/includes/Bootstrap/Backend/RewriteRules.php',
        'CommentConverter\\Plugin\\Bootstrap\\Frontend\\CommentForm' => __DIR__ . '/../..' . '/includes/Bootstrap/Frontend/CommentForm.php',
        'CommentConverter\\Plugin\\Bootstrap\\Frontend\\FollowerDashboardPage' => __DIR__ . '/../..' . '/includes/Bootstrap/Frontend/FollowerDashboardPage.php',
        'CommentConverter\\Plugin\\Bootstrap\\Frontend\\FollowerDashboardShortcode' => __DIR__ . '/../..' . '/includes/Bootstrap/Frontend/FollowerDashboardShortcode.php',
        'CommentConverter\\Plugin\\Bootstrap\\Frontend\\FollowingBadge' => __DIR__ . '/../..' . '/includes/Bootstrap/Frontend/FollowingBadge.php',
        'CommentConverter\\Plugin\\Container' => __DIR__ . '/../..' . '/includes/Container.php',
        'CommentConverter\\Plugin\\Database\\Models\\BaseModel' => __DIR__ . '/../..' . '/includes/Database/Models/BaseModel.php',
        'CommentConverter\\Plugin\\Database\\Models\\Follow' => __DIR__ . '/../..' . '/includes/Database/Models/Follow.php',
        'CommentConverter\\Plugin\\Database\\Models\\Follower' => __DIR__ . '/../..' . '/includes/Database/Models/Follower.php',
        'CommentConverter\\Plugin\\Database\\Repositories\\BaseRepository' => __DIR__ . '/../..' . '/includes/Database/Repositories/BaseRepository.php',
        'CommentConverter\\Plugin\\Database\\Repositories\\FollowRepository' => __DIR__ . '/../..' . '/includes/Database/Repositories/FollowRepository.php',
        'CommentConverter\\Plugin\\Database\\Repositories\\FollowerRepository' => __DIR__ . '/../..' . '/includes/Database/Repositories/FollowerRepository.php',
        'CommentConverter\\Plugin\\Database\\Schema\\Schema' => __DIR__ . '/../..' . '/includes/Database/Schema/Schema.php',
        'CommentConverter\\Plugin\\Emails\\BaseEmail' => __DIR__ . '/../..' . '/includes/Emails/BaseEmail.php',
        'CommentConverter\\Plugin\\Emails\\ConfirmationEmail' => __DIR__ . '/../..' . '/includes/Emails/ConfirmationEmail.php',
        'CommentConverter\\Plugin\\Emails\\NotificationEmail' => __DIR__ . '/../..' . '/includes/Emails/NotificationEmail.php',
        'CommentConverter\\Plugin\\Exceptions\\Container\\ContainerException' => __DIR__ . '/../..' . '/includes/Exceptions/Container/ContainerException.php',
        'CommentConverter\\Plugin\\Exceptions\\Container\\NotFoundException' => __DIR__ . '/../..' . '/includes/Exceptions/Container/NotFoundException.php',
        'CommentConverter\\Plugin\\Exceptions\\Exception' => __DIR__ . '/../..' . '/includes/Exceptions/Exception.php',
        'CommentConverter\\Plugin\\Exceptions\\PluginInstallationException' => __DIR__ . '/../..' . '/includes/Exceptions/PluginInstallationException.php',
        'CommentConverter\\Plugin\\Exceptions\\RestApi\\AuthorizationException' => __DIR__ . '/../..' . '/includes/Exceptions/RestApi/AuthorizationException.php',
        'CommentConverter\\Plugin\\Exceptions\\RestApi\\InvalidParamException' => __DIR__ . '/../..' . '/includes/Exceptions/RestApi/InvalidParamException.php',
        'CommentConverter\\Plugin\\Exceptions\\RestApi\\RestApiException' => __DIR__ . '/../..' . '/includes/Exceptions/RestApi/RestApiException.php',
        'CommentConverter\\Plugin\\Exceptions\\TokenAuthentication\\ExpiredTokenException' => __DIR__ . '/../..' . '/includes/Exceptions/TokenAuthentication/ExpiredTokenException.php',
        'CommentConverter\\Plugin\\Exceptions\\TokenAuthentication\\FollowerNotFoundException' => __DIR__ . '/../..' . '/includes/Exceptions/TokenAuthentication/FollowerNotFoundException.php',
        'CommentConverter\\Plugin\\Exceptions\\TokenAuthentication\\InvalidTokenException' => __DIR__ . '/../..' . '/includes/Exceptions/TokenAuthentication/InvalidTokenException.php',
        'CommentConverter\\Plugin\\Exceptions\\TokenAuthentication\\TokenAuthenticationException' => __DIR__ . '/../..' . '/includes/Exceptions/TokenAuthentication/TokenAuthenticationException.php',
        'CommentConverter\\Plugin\\Exceptions\\UserFacingException' => __DIR__ . '/../..' . '/includes/Exceptions/UserFacingException.php',
        'CommentConverter\\Plugin\\Gutenberg\\FollowByEmail' => __DIR__ . '/../..' . '/includes/Gutenberg/FollowByEmail.php',
        'CommentConverter\\Plugin\\Gutenberg\\Gutenberg' => __DIR__ . '/../..' . '/includes/Gutenberg/Gutenberg.php',
        'CommentConverter\\Plugin\\Gutenberg\\PostSettings' => __DIR__ . '/../..' . '/includes/Gutenberg/PostSettings.php',
        'CommentConverter\\Plugin\\Plugin' => __DIR__ . '/../..' . '/includes/Plugin.php',
        'CommentConverter\\Plugin\\RestApi\\Controllers\\AMPluginsController' => __DIR__ . '/../..' . '/includes/RestApi/Controllers/AMPluginsController.php',
        'CommentConverter\\Plugin\\RestApi\\Controllers\\BaseController' => __DIR__ . '/../..' . '/includes/RestApi/Controllers/BaseController.php',
        'CommentConverter\\Plugin\\RestApi\\Controllers\\DashboardController' => __DIR__ . '/../..' . '/includes/RestApi/Controllers/DashboardController.php',
        'CommentConverter\\Plugin\\RestApi\\Controllers\\FollowController' => __DIR__ . '/../..' . '/includes/RestApi/Controllers/FollowController.php',
        'CommentConverter\\Plugin\\RestApi\\Controllers\\FollowerController' => __DIR__ . '/../..' . '/includes/RestApi/Controllers/FollowerController.php',
        'CommentConverter\\Plugin\\RestApi\\Controllers\\PostSettingsController' => __DIR__ . '/../..' . '/includes/RestApi/Controllers/PostSettingsController.php',
        'CommentConverter\\Plugin\\RestApi\\Controllers\\SettingsController' => __DIR__ . '/../..' . '/includes/RestApi/Controllers/SettingsController.php',
        'CommentConverter\\Plugin\\RestApi\\Controllers\\UploadController' => __DIR__ . '/../..' . '/includes/RestApi/Controllers/UploadController.php',
        'CommentConverter\\Plugin\\RestApi\\RestApi' => __DIR__ . '/../..' . '/includes/RestApi/RestApi.php',
        'CommentConverter\\Plugin\\Services\\DataStats' => __DIR__ . '/../..' . '/includes/Services/DataStats.php',
        'CommentConverter\\Plugin\\Services\\EmailControl' => __DIR__ . '/../..' . '/includes/Services/EmailControl.php',
        'CommentConverter\\Plugin\\Services\\FollowControl' => __DIR__ . '/../..' . '/includes/Services/FollowControl.php',
        'CommentConverter\\Plugin\\Services\\FollowerControl' => __DIR__ . '/../..' . '/includes/Services/FollowerControl.php',
        'CommentConverter\\Plugin\\Services\\SystemControl' => __DIR__ . '/../..' . '/includes/Services/SystemControl.php',
        'CommentConverter\\Plugin\\Settings\\Options' => __DIR__ . '/../..' . '/includes/Settings/Options.php',
        'CommentConverter\\Plugin\\Settings\\PostMeta' => __DIR__ . '/../..' . '/includes/Settings/PostMeta.php',
        'CommentConverter\\Plugin\\Settings\\Settings' => __DIR__ . '/../..' . '/includes/Settings/Settings.php',
        'CommentConverter\\Plugin\\Utils\\AMPlugins' => __DIR__ . '/../..' . '/includes/Utils/AMPlugins.php',
        'CommentConverter\\Plugin\\Utils\\AMPlugins\\AMPlugin' => __DIR__ . '/../..' . '/includes/Utils/AMPlugins/AMPlugin.php',
        'CommentConverter\\Plugin\\Utils\\AMPlugins\\InstallSkin' => __DIR__ . '/../..' . '/includes/Utils/AMPlugins/InstallSkin.php',
        'CommentConverter\\Plugin\\Utils\\Arr' => __DIR__ . '/../..' . '/includes/Utils/Arr.php',
        'CommentConverter\\Plugin\\Utils\\Date' => __DIR__ . '/../..' . '/includes/Utils/Date.php',
        'CommentConverter\\Plugin\\Utils\\Html' => __DIR__ . '/../..' . '/includes/Utils/Html.php',
        'CommentConverter\\Plugin\\Utils\\Urls' => __DIR__ . '/../..' . '/includes/Utils/Urls.php',
        'CommentConverter\\Plugin\\Utils\\Utils' => __DIR__ . '/../..' . '/includes/Utils/Utils.php',
        'CommentConverter\\Plugin\\Utils\\VariableReplacer' => __DIR__ . '/../..' . '/includes/Utils/VariableReplacer.php',
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitb59578d06fb8370da6a37827ae165a06::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitb59578d06fb8370da6a37827ae165a06::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitb59578d06fb8370da6a37827ae165a06::$classMap;

        }, null, ClassLoader::class);
    }
}
