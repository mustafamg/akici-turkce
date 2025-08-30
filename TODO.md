# Header Color Changes Implementation

## Completed Tasks:
- [x] Updated `header.ts` to add route detection logic
  - Added Router service injection
  - Added route change subscription
  - Added method to determine background class based on current route
  - Added `isLoginPage` property to track login page state
- [x] Updated `header.html` to use dynamic class binding
  - Replaced static `bg-beige` with `[ngClass]="currentBgClass"`
  - Added conditional text color classes for "Login" and "Sign Up" buttons
- [x] Updated `header.scss` to add new CSS classes
  - Added `.bg-white` class for white background
  - Added `.bg-red` class for red background using exact color #C41E3A
  - Added `.text-red` class for red text color using exact color #C41E3A

## Additional Changes:
- [x] Updated header red background to use exact color #C41E3A (same as logo and login page)
- [x] Made "Login" and "Sign Up" button text red (#C41E3A) on login page
- [x] Made "Akıcı Türkçe" text dark red (#C41E3A) on home page, white on login page
- [x] Made Login and Sign Up buttons dark red (#C41E3A) on home page
- [x] Updated logo to have white circles on login page for visibility against red background
- [x] Updated logo to have red circles on home page

## Signup Component Implementation:
- [x] Created `signup.ts` component with username, password, and hidden role (default: 'learner')
- [x] Created `signup.html` template with same design as login
- [x] Created `signup.scss` with same styling as login
- [x] Updated AuthService to add `signup` method
- [x] Updated AuthService login method to accept username instead of email
- [x] Added signup route to auth routing module
- [x] Added signup route to app routes
- [x] Updated header Sign Up button with routerLink="/signup"
- [x] Updated header route detection to handle signup page

## Footer Updates:
- [x] Updated `footer.html` to add routerLink directives
  - Changed Login link from `href="#"` to `routerLink="/login"`
  - Changed Signup link from `href="#"` to `routerLink="/signup"`
- [x] Updated `footer.ts` to import RouterModule
  - Added RouterModule to imports array for routerLink functionality

## Testing Required:
- [ ] Test home page (route '/') - should have white header with normal button colors
- [ ] Test login page (route '/login') - should have red header (#C41E3A) with red button text
- [ ] Test signup page (route '/signup') - should have red header (#C41E3A) with red button text
- [ ] Test other pages - should fall back to beige background with normal button colors
- [ ] Test signup functionality
- [ ] Test footer links - Login and Signup should navigate to respective pages
