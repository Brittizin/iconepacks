package com.pocketdeck.remote;

import android.content.Intent;
import android.content.pm.ShortcutInfo;
import android.content.pm.ShortcutManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Icon;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.GridView;
import android.widget.ImageView;
import android.widget.SearchView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends AppCompatActivity {
    private final List<IconEntry> allIcons = new ArrayList<>();
    private final List<IconEntry> filteredIcons = new ArrayList<>();
    private final Map<String, Bitmap> bitmapCache = new HashMap<>();

    private TextView packTitleView;
    private TextView packSubtitleView;
    private TextView emptyView;
    private SearchView searchView;
    private GridView iconGrid;
    private IconAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        packTitleView = findViewById(R.id.packTitle);
        packSubtitleView = findViewById(R.id.packSubtitle);
        emptyView = findViewById(R.id.emptyState);
        searchView = findViewById(R.id.searchView);
        iconGrid = findViewById(R.id.iconGrid);

        adapter = new IconAdapter();
        iconGrid.setAdapter(adapter);
        iconGrid.setOnItemClickListener((parent, view, position, id) -> applyIcon(filteredIcons.get(position)));

        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                applyFilter(query);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                applyFilter(newText);
                return true;
            }
        });

        loadPack();
    }

    private void loadPack() {
        try (InputStream inputStream = getAssets().open("icon-pack.json")) {
            JSONObject root = new JSONObject(readAll(inputStream));
            JSONArray icons = root.getJSONArray("icons");

            allIcons.clear();
            for (int i = 0; i < icons.length(); i += 1) {
                JSONObject item = icons.getJSONObject(i);
                JSONArray packages = item.getJSONArray("packages");
                List<String> packageNames = new ArrayList<>();
                for (int j = 0; j < packages.length(); j += 1) {
                    packageNames.add(packages.getString(j));
                }

                allIcons.add(new IconEntry(item.getString("slug"), item.getString("name"), packageNames));
            }

            Collections.sort(allIcons, Comparator.comparing(icon -> icon.name));
            packTitleView.setText(root.optString("packName", getString(R.string.app_name)));
            packSubtitleView.setText(getString(R.string.pack_stats, allIcons.size()));

            filteredIcons.clear();
            filteredIcons.addAll(allIcons);
            adapter.notifyDataSetChanged();
            updateEmptyState();
        } catch (Exception exception) {
            packTitleView.setText(R.string.app_name);
            packSubtitleView.setText(R.string.pack_load_error);
            emptyView.setVisibility(View.VISIBLE);
            emptyView.setText(R.string.pack_load_error);
        }
    }

    private void applyFilter(String query) {
        String normalized = query == null ? "" : query.trim().toLowerCase();
        filteredIcons.clear();

        if (normalized.isEmpty()) {
            filteredIcons.addAll(allIcons);
        } else {
            for (IconEntry icon : allIcons) {
                if (icon.matches(normalized)) {
                    filteredIcons.add(icon);
                }
            }
        }

        packSubtitleView.setText(getString(R.string.pack_filter_stats, filteredIcons.size(), allIcons.size()));
        adapter.notifyDataSetChanged();
        updateEmptyState();
    }

    private void updateEmptyState() {
        emptyView.setVisibility(filteredIcons.isEmpty() ? View.VISIBLE : View.GONE);
        iconGrid.setVisibility(filteredIcons.isEmpty() ? View.GONE : View.VISIBLE);
    }

    private void applyIcon(IconEntry icon) {
        Intent launchIntent = icon.resolveLaunchIntent();
        if (launchIntent == null) {
            Toast.makeText(this, getString(R.string.app_not_installed, icon.name), Toast.LENGTH_SHORT).show();
            return;
        }

        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            Toast.makeText(this, R.string.shortcut_unsupported, Toast.LENGTH_SHORT).show();
            return;
        }

        ShortcutManager shortcutManager = getSystemService(ShortcutManager.class);
        if (shortcutManager == null || !shortcutManager.isRequestPinShortcutSupported()) {
            Toast.makeText(this, R.string.shortcut_unsupported, Toast.LENGTH_SHORT).show();
            return;
        }

        Bitmap bitmap = getBitmap(icon.slug);
        if (bitmap == null) {
            Toast.makeText(this, R.string.icon_load_failed, Toast.LENGTH_SHORT).show();
            return;
        }

        ShortcutInfo shortcut = new ShortcutInfo.Builder(this, "breakcore_" + icon.slug)
            .setShortLabel(icon.name)
            .setIntent(launchIntent)
            .setIcon(Icon.createWithBitmap(bitmap))
            .build();

        shortcutManager.requestPinShortcut(shortcut, null);
        Toast.makeText(this, getString(R.string.shortcut_requested, icon.name), Toast.LENGTH_SHORT).show();
    }

    private Bitmap getBitmap(String slug) {
        Bitmap cached = bitmapCache.get(slug);
        if (cached != null) {
            return cached;
        }

        try (InputStream inputStream = getAssets().open("icons/" + slug + ".png")) {
            Bitmap bitmap = BitmapFactory.decodeStream(inputStream);
            bitmapCache.put(slug, bitmap);
            return bitmap;
        } catch (Exception exception) {
            return null;
        }
    }

    private String readAll(InputStream inputStream) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];
        int read;
        while ((read = inputStream.read(buffer)) != -1) {
            outputStream.write(buffer, 0, read);
        }
        return outputStream.toString(StandardCharsets.UTF_8.name());
    }

    private final class IconAdapter extends BaseAdapter {
        private final LayoutInflater inflater = LayoutInflater.from(MainActivity.this);

        @Override
        public int getCount() {
            return filteredIcons.size();
        }

        @Override
        public Object getItem(int position) {
            return filteredIcons.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            ViewHolder holder;
            if (convertView == null) {
                convertView = inflater.inflate(R.layout.item_icon, parent, false);
                holder = new ViewHolder(convertView);
                convertView.setTag(holder);
            } else {
                holder = (ViewHolder) convertView.getTag();
            }

            IconEntry icon = filteredIcons.get(position);
            holder.nameView.setText(icon.name);
            holder.statusView.setText(icon.isInstalled() ? R.string.tap_to_apply : R.string.not_installed);
            holder.statusView.setAlpha(icon.isInstalled() ? 1f : 0.55f);
            holder.iconView.setImageBitmap(getBitmap(icon.slug));
            holder.root.setAlpha(icon.isInstalled() ? 1f : 0.7f);
            return convertView;
        }
    }

    private final class IconEntry {
        private final String slug;
        private final String name;
        private final List<String> packages;

        private IconEntry(String slug, String name, List<String> packages) {
            this.slug = slug;
            this.name = name;
            this.packages = packages;
        }

        private boolean matches(String query) {
            if (name.toLowerCase().contains(query) || slug.toLowerCase().contains(query)) {
                return true;
            }

            for (String packageName : packages) {
                if (packageName.toLowerCase().contains(query)) {
                    return true;
                }
            }

            return false;
        }

        private Intent resolveLaunchIntent() {
            for (String packageName : packages) {
                Intent intent = getPackageManager().getLaunchIntentForPackage(packageName);
                if (intent != null) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED);
                    return intent;
                }
            }
            return null;
        }

        private boolean isInstalled() {
            return resolveLaunchIntent() != null;
        }
    }

    private static final class ViewHolder {
        private final View root;
        private final ImageView iconView;
        private final TextView nameView;
        private final TextView statusView;

        private ViewHolder(View root) {
            this.root = root;
            iconView = root.findViewById(R.id.iconImage);
            nameView = root.findViewById(R.id.iconName);
            statusView = root.findViewById(R.id.iconStatus);
        }
    }
}
