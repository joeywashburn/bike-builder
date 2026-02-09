import { redirect, Form, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>🚲 Bike Builder for Shopify</h1>
        <p className={styles.text}>
          Let your customers build their dream bike by selecting individual components with live price updates and seamless checkout.
        </p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Shop domain</span>
              <input className={styles.input} type="text" name="shop" placeholder="my-shop-domain.myshopify.com" />
              <span>e.g: my-shop-domain.myshopify.com</span>
            </label>
            <button className={styles.button} type="submit">
              Log in
            </button>
          </Form>
        )}
        <ul className={styles.list}>
          <li>
            <strong>Interactive Bike Builder</strong>. Customers select parts from organized categories with variant options and see their total update in real-time.
          </li>
          <li>
            <strong>Tag-Based Setup</strong>. Simply tag your products with bike-builder-frame, bike-builder-fork, etc. No complex product mapping required.
          </li>
          <li>
            <strong>Theme Customization</strong>. Match your store's branding with customizable colors, fonts, and text directly from the admin panel.
          </li>
          <li>
            <strong>Build Fee Management</strong>. Charge assembly fees with conditional pricing. Optionally waive fees for high-value builds.
          </li>
          <li>
            <strong>Seamless Integration</strong>. Theme app extension works with any Shopify theme. Real cart integration for smooth checkout experience.
          </li>
        </ul>
        <p className={styles.text} style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: 0.8 }}>
          Install from the Shopify App Store or contact support for assistance.
        </p>
      </div>
    </div>
  );
}
