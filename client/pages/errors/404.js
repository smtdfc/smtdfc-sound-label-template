export const Page = Turtle.createComponent({
  template() {
    return this.html`
      <div class="root " style="display: flex; justify-content: center; align-items: center;">
        <div class="text-center" style="padding: 20px;">
          <h1 class="heading-1" style="font-size: 6rem; color: #ff4d4d;">404</h1>
          <h2 class="heading-2" style="font-size: 2rem;">Page Not Found</h2>
          <p style="font-size: 1.2rem; color: #888;">Sorry, the page you're looking for might have been moved or deleted.</p>
          <a href="#!/" class="btn btn-primary" style="margin-top: 50px;">Go Back to Home</a>
        </div>
      </div>
    `;
  },
});