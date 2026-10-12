import { MiniApp } from '@/components/app/MiniApp';
import { getPublicMiniAppLink } from '@/server/telegram/links';

const HomePage = () => (
  <main>
    <MiniApp telegramLink={getPublicMiniAppLink()} />
  </main>
);

export default HomePage;
