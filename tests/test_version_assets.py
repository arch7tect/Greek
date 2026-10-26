import importlib.util
from pathlib import Path
import tempfile
from types import SimpleNamespace
import unittest


spec = importlib.util.spec_from_file_location("version_assets", Path(__file__).parents[1] / "scripts/version_assets.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class AssetVersionsTest(unittest.TestCase):
    def test_changed_dictionary_gets_new_url_without_changing_external_links(self):
        with tempfile.TemporaryDirectory() as folder:
            source = Path(folder) / "assets/data/vocabulary-data.js"
            source.parent.mkdir(parents=True)
            source.write_text("old")
            html = '<script src="../../assets/data/vocabulary-data.js"></script><a href="https://example.com/x.js">x</a>'
            page = SimpleNamespace(url="training/vocabulary/")
            first = module.on_post_page(html, page, {"docs_dir": folder})
            source.write_text("new")
            second = module.on_post_page(html, page, {"docs_dir": folder})
            self.assertNotEqual(first, second)
            self.assertIn("vocabulary-data.js?v=", second)
            self.assertIn('href="https://example.com/x.js"', second)
            self.assertEqual(second, module.on_post_page(second, page, {"docs_dir": folder}))


if __name__ == "__main__":
    unittest.main()
