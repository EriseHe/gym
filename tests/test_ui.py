"""Current UI regression suite. See test_v3.py for offline/HTTP modes."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).with_name('test_v3.py')), run_name='__main__')
