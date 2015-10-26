=== Plugin Name ===
Contributors: (edkestler, fkestler)
Tags: intranet, extranet, workflow, file sharing, bpmcontext, collaboration, customer portal, supplier portal, online project management, task management, file sharing, share files online, team collaboration, team workspace, online collaboration, collaborate, online file sharing secure file sharing, knowledgebase, repository, get more done, workflow, task assignment, process management, wordpress app integration, action item, ftp alternative, client portal, white label, private label
Donate link: 
Requires at least: 3.0.1
Tested up to: 4.2.4
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Extend your WordPress installation with BPMContext Intranet Solutions. This plugin adds a login from WordPress to BPMContext.

== Description ==  

#### BPMContext - Integrating Collaborative Workspaces With Wordpress Marketing Sites. Experience a single branded experience for your team, customers and suppliers.


BPMContext makes it easy for your team to collaborate in one place. BPMContext Login adds intranet/extranet capabilities with workflow for sharing files and managing tasks and projects.  Designed for small and medium sized teams and organizations. It is easy to get started with no credit card required at https://bpmcontext.com.
#### Overview:

* Intranet Workspaces for sharing information such as news, announcements, department policies and procedures, time off approvals, IT Help Tickets and Facility Request Orders.
* Collaborative Workspaces - Workspaces are pre - loaded. A Context Site Map displays the linked workspaces.  
* Add workspaces as you grow - Pay for business users to get access to additional workspaces.
* Workflow Automation - Get more done with workflow to automate and manage repetitive support requests. Workflow can be assigned to a collaborative workspaces in Intranet Solutions.
* Prioritize your assignments and the team’s to-do list.
* Knowledge Repository - Onboard team members more quickly with access to shared files and content by activity.

#### Intranet Workspaces:

Easy to use and set up, intranet workspaces are designed to help departments and teams work together. Create announcements, news reports, publish time off requests, IT support tickets, facility help requests, meeting minutes and action items.

#### Extranet Workspaces:

Add Extranet capabilities when you pay for business users and get access to shared workspaces for customers. Onboard customers and make it easy to work together by sharing files, content and updates in one place.


#### Project Management Workspaces:

Manage project communications to keep everyone informed about change requests, impact notices and more.



== About this Plugin ==  

This plugin connects to BPMContext.com to check if the user is currently logged into BPMContext.  If the user is not logged in, then a login form is placed either in the header of the page, or anywhere you specify, to allow your team members, customers and suppliers to login.  The plugin sends the login credentials to BPMContext and, if validated, the user is then connected to the BPMContext intranet / extranet account that you created.  Only those team members, customers or suppliers that you have invited are able to login to the account.  

If the user is logged in, then My Dashboard and logout buttons are displayed instead of the login form.  By clicking the My Dashboard button, the user’s BPMContext account is opened so they can use the intranet / extranet features of BPMContext.  By clicking Logout, the user is logged out of BPMContext and will have to login again to access the intranet / extranet features. 



== Installation ==

1. Upload `bpmcontext.zip` to the Wordpress plugin manager.
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to Settings in the left menu and edit the configuration as desired.

### ADMIN OPTIONS


1.	Login Button Name – this sets the name of the Login button and of any menu items used to launch the login process.  Login button is displayed if the user is NOT currently logged into BPMContext from the current browser.
2.	Dashboard Button Name - this sets the name of the Dashboard button and of any menu items used to launch the login process.  The Dashboard button is displayed if the user IS currently logged into BPMContext from the current browser.
3.	Logout Button Name - this sets the name of the Logout button.
4.	Get Password Button Name - this sets the name of the Get Password button.
5.	User Header Option – if this is selected then the Header version of the BPMContext login or dashboard UI is displayed at the top of the page.

### CLASS OPTIONS


1.	Adding bpm_login_hover class to a menu item will set the name to the Login button name or Dashboard button name depending on login status.  
	a.	If a user is NOT logged in and they hover over this menu item, then a Login window is displayed.
	b.	If a user is NOT logged in and they click this menu item, then any hyperlinks to this menu item are ignored as the login menu has already been displayed when they hovered over the menu item.
	c.	If a user is logged in and they hover nothing happens.
	d.	If a user is logged in and they click this menu item, then they are taken to the BPMContext website and any hyperlinks to this menu item are ignored.
2.	Adding bpm_login_click class to a menu item will set the name to the Login button or Dashboard button depending on login status.  
	a.	If a user is NOT logged in and they click this menu item, then a Login window is displayed.
	b.	If a user is NOT logged in and they click this menu item, then any hyperlinks to this menu item are ignored as the login menu has already been displayed when they clicked the menu item.
	c.	If a user is logged in and they click this menu item, then they are taken to the BPMContext website and any hyperlinks to this menu item are ignored.
3.	The header option uses the class ‘bpm_header_div’.  Changes can be made to the styling by targeting that class.
4.	Adding a div with the ‘bpm_login_wide’ class will create a wide format login div on the page. You must set an id on the div.  Or use the shortcode [BPM_Wide_Login]
5.	Adding a div with the ‘bpm_login_tall’ class will create a tall format login div on the page. You must set an id on the div.  Or use the shortcode [BPM_Tall_Login]

== Frequently Asked Questions ==

= What are some examples of how teams use the system? =

Teams use the system to organize IT support requests, delegate customer service requests, manage sales through delivery from sales quotes to product development to project management.

= How do I know if BPMContext is a good fit for my organization? =

BPMContext is a good fit if you use file sharing such as Dropbox, Box, Drive, etc.; if people manage tasks using email to send updates and attach files. It is commonly used for communications on projects, customer service, customer quotes and reports, and more.

= What does the BPMContext Administrator role? =

The Administrator is the only role that is allowed to add new users, manage billing, delete and rename pages, stop and restart sharing, install new templates to the hierarchy, configure sharing and change routing. At a minimum, an account must have one administrator to use the system.

= Can I invite my customers to share files? =

Yes. You can share files and manage customer workflows such as approvals, invoices and more. Each customer gets their own set of workspaces for an activity. Invite them to share files, add to the discussion and manage their company data. 



== Screenshots ==

1. Screenshot of Header version of the Login form.  
2. Screenshot of Header view when the user is already logged in.  Click My Dashboard to go to BPMContext or Logout to logout.
3. Screenshot of Lost password feature.
4. Screenshot of Tall version of the Login form.

== Changelog ==

= 1.0 =
* Current version


== Upgrade Notice ==

= 1.0 =
First version of the plugin. Signup for a BPMContext account to activate shared storage. 1 Admin signup per month minimum.